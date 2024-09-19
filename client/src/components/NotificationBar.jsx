import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import Api from '../common/index';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Spinner from '../components/Spinner'

const NotificationBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasUnread, setHasUnread] = useState(false); // Track if there are unread notifications
    const [selectedTab, setSelectedTab] = useState(0); // Track the selected tab

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(Api.getNotifications.url);
                if (response.data && Array.isArray(response.data.data)) {
                    const fetchedNotifications = response.data.data;
                    setNotifications(fetchedNotifications);
                    // Check if there are unread notifications
                    setHasUnread(fetchedNotifications.some(notification => !notification.read));
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setNotifications([]);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(Api.readNotifications.url, { notificationId });
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            );
            setNotifications(updatedNotifications);
            // Check if there are still unread notifications
            setHasUnread(updatedNotifications.some(notification => !notification.read));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(Api.readNotifications.url, { notificationId: 'all' });
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
            setHasUnread(false);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };


    const toggleNotificationBar = () => {
        setIsVisible(!isVisible);
    };

    const newNotifications = notifications.filter(notification => !notification.read);
    const oldNotifications = notifications.filter(notification => notification.read);

    return (
        <>
            <div
                className={`fixed top-4 right-4 cursor-pointer text-2xl z-50 ${hasUnread ? 'text-red-500' : 'text-gray-700'}`}
                onClick={toggleNotificationBar}
            >
                <div className="relative">
                    <FaBell />
                    {hasUnread && (
                        <span className="absolute top-0 right-0 block w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    )}
                </div>
            </div>
            <div
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 z-40 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
            >
                <div className="p-4 border-b border-gray-200 flex flex-col items-start">
                    <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                    <button
                        onClick={markAllAsRead}
                        className="text-blue-500 underline mb-2 hover:text-blue-800"
                    >
                        Read All
                    </button>
                    <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
                        <TabList>
                            <Tab>Unread</Tab>
                            <Tab>Read</Tab>
                        </TabList>
                        <TabPanel>
                            <div className="p-2 overflow-y-auto h-96">
                                {loading ? (
                                    <Spinner />
                                ) : newNotifications.length > 0 ? (
                                    newNotifications.map(notification => (
                                        <div key={notification._id} className={`p-2 ${notification.read ? 'bg-gray-100' : 'bg-white'} border-b border-gray-200`}>
                                            <p>{notification.message}</p>
                                            <p className="text-sm text-gray-500">{moment(notification.createdAt).format('MMM D, YYYY h:mm A')}</p>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="mt-1 text-blue-500"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No new notifications</p>
                                )}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="p-2 overflow-y-auto h-96">
                                {loading ? (
                                    <Spinner />
                                ) : oldNotifications.length > 0 ? (
                                    oldNotifications.map(notification => (
                                        <div key={notification._id} className={`p-2 ${notification.read ? 'bg-gray-100' : 'bg-white'} border-b border-gray-200`}>
                                            <p>{notification.message}</p>
                                            <p className="text-sm text-gray-500">{moment(notification.createdAt).format('MMM D, YYYY h:mm A')}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No old notifications</p>
                                )}
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default NotificationBar;
