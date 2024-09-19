import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Api from '../../common/index';
import Pagination from '../Pagination';
import EditProjectForm from './EditProjectForm';
import ProjectDetailsModal from './ProjectDetailsModal';

const ProjectsTable = () => {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(10);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(Api.getProject.url, {
                    timeout: 5000,
                });
                setProjects(response.data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleEditProject = (project) => {
        setEditingProject(project);
    };

    const handleSaveProject = (updatedProject) => {
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
        setEditingProject(null);
    };

    const handleCancelEdit = () => {
        setEditingProject(null);
    };

    const handleViewDetails = (project) => {
        setSelectedProject(project);
    };

    const handleFillProductionSheet = (project) => {
        navigate('/sheet', { state: { project } }); // Pass project data as state
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    const truncateText = (text, maxWords = 1) => {
        if (typeof text !== 'string') return '';

        const words = text.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return text;
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-x-auto">
            {editingProject ? (
                <EditProjectForm
                    project={editingProject}
                    onSave={handleSaveProject}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        <thead className="bg-gray-100 text-gray-900 uppercase text-sm font-semibold">
                            <tr>
                                <th className="py-2 px-3 border-b border-gray-300">Project Name</th>
                                <th className="py-2 px-3 border-b border-gray-300">Customer Name</th>
                                <th className="py-2 px-3 border-b border-gray-300">Customer Contact</th>
                                <th className="py-2 px-3 border-b border-gray-300">Project Manager</th>
                                <th className="py-2 px-3 border-b border-gray-300">Location</th>
                                <th className="py-2 px-3 border-b border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 text-base">
                            {currentProjects.map((project, index) => (
                                <tr
                                    key={project._id}
                                    className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                                >
                                    <td className="py-4 px-6 border-b border-gray-300 text-center truncate">
                                        {truncateText(project.projectName)}
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-300 text-center truncate">
                                        {truncateText(project.clientId?.clientName)}
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-300 text-center truncate">
                                        {project.clientContact}
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-300 text-center truncate">
                                        {truncateText(project.projectManager?.name)}
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-300 text-center truncate">
                                        {truncateText(project.location)}
                                    </td>
                                    <td className="py-4 px-6 border-b border-gray-300 text-center">
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={() => handleViewDetails(project)}
                                                className="text-blue-500 hover:text-blue-700 text-xl"
                                                title="View Details"
                                            >
                                                <FaEye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleEditProject(project)}
                                                className="text-green-500 hover:text-green-700 text-xl"
                                                title="Edit Project"
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleFillProductionSheet(project)}
                                                className="text-red-500 hover:text-red-700 text-xl"
                                                title="Fill Production Sheet"
                                            >
                                                <FaFileAlt size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(projects.length / projectsPerPage)}
                        onPageChange={paginate}
                    />
                    {selectedProject && (
                        <ProjectDetailsModal
                            project={selectedProject}
                            onClose={closeModal}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProjectsTable;
