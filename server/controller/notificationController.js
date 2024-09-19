const Notification = require('../models/notificationModel');

// Get all notifications
async function getNotificationsController(req, res) {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Notifications fetched successfully',
            data: notifications,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Mark notification as read
async function markNotificationAsReadController(req, res) {
    try {
        const { notificationId } = req.body;

        // Check if notificationId is provided
        if (!notificationId) {
            return res.status(400).json({
                message: 'Notification ID is required',
                error: true,
                success: false
            });
        }

        if (notificationId === 'all') {
            // Mark all notifications as read
            const result = await Notification.updateMany({ read: false }, { $set: { read: true } });
            res.status(200).json({
                message: 'All notifications marked as read',
                data: result,
                success: true,
                error: false
            });
        } else {
            // Mark a specific notification as read
            const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
            if (!notification) {
                return res.status(404).json({
                    message: 'Notification not found',
                    error: true,
                    success: false
                });
            }
            res.status(200).json({
                message: 'Notification marked as read',
                data: notification,
                success: true,
                error: false
            });
        }
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

module.exports = {
    getNotificationsController,
    markNotificationAsReadController
};
