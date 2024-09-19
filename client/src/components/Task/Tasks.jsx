import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal';
import TaskTable from './TaskTable';
import Pagination from '../Pagination';
import Api from '../../common/index';
import Spinner from '../Spinner';
import { TbListDetails } from "react-icons/tb";
import EditTaskModal from './EditTaskModal';

const Tasks = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskDetails, setTaskDetails] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get(Api.getTask.url);
            if (data && data.data) {
                setTasks(data.data);
            } else {
                console.error('Unexpected data format:', data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        try {
            await fetchTasks();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error fetching tasks after adding:', error);
        }
    };

    const handleViewTask = (task) => {
        setTaskDetails(task);
        setIsViewModalOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskDetails(task);
        setIsEditModalOpen(true);
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
    };

    // Pagination logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    // Function to handle page changes
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
            >
                <TbListDetails className="mr-2 text-xl" />
                Add Task
            </button>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {tasks.length > 0 ? (
                        <>
                            <TaskTable
                                tasks={currentTasks}
                                onView={handleViewTask}
                                onEdit={handleEditTask}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(tasks.length / tasksPerPage)}
                                onPageChange={paginate}
                            />
                        </>
                    ) : (
                        <p>No tasks available.</p>
                    )}
                </>
            )}

            <TaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTask}
            />

            <TaskModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                taskDetails={taskDetails}
                isViewOnly={true}
            />

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                task={taskDetails}
                onUpdate={handleUpdateTask}
            />
        </div>
    );
};

export default Tasks;