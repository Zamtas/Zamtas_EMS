import { useState, useEffect } from 'react';
import ProjectManagerModal from './ProjectManagerModal';
import ProjectManagerTable from './ProjectManagerTable';
import Pagination from '../Pagination';
import Spinner from '../Spinner';
import axios from 'axios';
import Api from '../../common/index';
import { RiUserSettingsFill } from "react-icons/ri";

const ProjectManagers = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentManager, setCurrentManager] = useState(null);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [managersPerPage] = useState(10);
    const [modalMode, setModalMode] = useState('view'); // Ensure default mode is 'view'

    const fetchProjectManagers = async () => {
        try {
            const { data } = await axios.get(Api.getProjectManager.url);
            setManagers(data.data);
        } catch (error) {
            console.error('Error fetching project managers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectManagers();
    }, []);

    const handleViewManager = async (manager) => {
        try {
            const { data } = await axios.get(Api.getManager.url.replace(':managerId', manager._id));
            setCurrentManager(data.data);
            setModalMode('view');
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching manager details:', error);
        }
    };

    const handleEditManager = async (manager) => {
        try {
            const { data } = await axios.get(Api.getManager.url.replace(':managerId', manager._id));
            setCurrentManager(data.data);
            setModalMode('edit');
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching manager details for edit:', error);
        }
    };

    const handleSaveManager = async (managerId, updatedData) => {
        try {
            const response = await axios.put(Api.updateProjectManager.url.replace(':managerId', managerId), updatedData);
            setManagers((prevManagers) => prevManagers.map(manager =>
                manager._id === managerId ? response.data.data : manager
            ));
            setModalOpen(false);
        } catch (error) {
            console.error('Error saving project manager:', error);
        }
    };

    const handleAddProjectManager = async (newManager) => {
        try {
            const response = await axios.post(Api.addProjectManager.url, newManager);
            setManagers((prevManagers) => [...prevManagers, response.data.data]);
            setModalOpen(false);
        } catch (error) {
            console.error('Error adding project manager:', error);
        }
    };

    const handleAddButtonClick = () => {
        setCurrentManager(null); // Ensure currentManager is null for new manager
        setModalMode('add'); // Set mode to 'add'
        setModalOpen(true);
    };

    // Get current managers
    const indexOfLastManager = currentPage * managersPerPage;
    const indexOfFirstManager = indexOfLastManager - managersPerPage;
    const currentManagers = managers.slice(indexOfFirstManager, indexOfLastManager);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
            <button
                onClick={handleAddButtonClick} // Update button click handler
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex items-center"
            >
                <RiUserSettingsFill className="mr-2 text-xl" />
                Add Project Manager
            </button>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <>
                    <ProjectManagerTable
                        managers={currentManagers}
                        onEdit={handleEditManager}
                        onView={handleViewManager}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(managers.length / managersPerPage)}
                        onPageChange={paginate}
                    />
                </>
            )}
            <ProjectManagerModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddProjectManager}
                onSave={handleSaveManager}
                manager={currentManager}
                mode={modalMode}
            />
        </div>
    );
};

export default ProjectManagers;
