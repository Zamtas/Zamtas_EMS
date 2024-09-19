import { useState, useEffect, useCallback } from 'react';
import ProjectModal from './ProjectModal';
import ProjectsTable from './ProjectsTable';
import { FaPlusSquare } from 'react-icons/fa';
import Spinner from '../Spinner';
import axios from 'axios';
import Api from '../../common/index';

const Projects = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(Api.getProject.url);
            setProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddProject = () => {
        setModalOpen(false);
        fetchData();
    };

    const handleUpdateProject = (updatedProject) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project._id === updatedProject._id ? updatedProject : project
            )
        );
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
            <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex items-center"
                onClick={() => setModalOpen(true)}
            >
                <FaPlusSquare className="mr-2 text-xl" />
                Add New Project
            </button>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <ProjectsTable
                        projects={projects}
                        onUpdateProject={handleUpdateProject}
                    />
                </div>
            )}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddProject}
            />
        </div>
    );
};

export default Projects;