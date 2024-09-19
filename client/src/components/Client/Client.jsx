import { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../common/index';
import ClientModal from './ClientModal';
import ClientTable from './ClientTable';
import Pagination from '../Pagination';
import Spinner from '../Spinner';
import { TbUserShield } from "react-icons/tb";

const Client = () => {
    const [clients, setClients] = useState([]);
    const [currentClient, setCurrentClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 10;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { data } = await axios.get(Api.getClient.url);
                setClients(data.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const fetchClientById = async (id) => {
        try {
            const url = Api.getClientById.url.replace(':id', id);
            const { data } = await axios.get(url);
            setCurrentClient(data.data);
            setViewModalOpen(true);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const handleAddClient = (newClient) => {
        setClients(prevClients => [...prevClients, newClient]);
        setAddModalOpen(false);
    };

    const handleEditClient = (client) => {
        setCurrentClient(client);
        setEditModalOpen(true);
    };

    const handleUpdateClient = (updatedClient) => {
        setClients(prevClients =>
            prevClients.map(client => (client._id === updatedClient._id ? updatedClient : client))
        );
        setEditModalOpen(false);
    };

    // Pagination logic
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
            <button
                onClick={() => setAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
                <TbUserShield className="mr-2 text-xl" />
                Add Customer
            </button>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <ClientTable
                        clients={currentClients}
                        onView={fetchClientById}
                        onEdit={handleEditClient}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(clients.length / clientsPerPage)}
                        onPageChange={paginate}
                    />
                </>
            )}

            <ClientModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={handleAddClient}
                modalType="add"
            />
            <ClientModal
                isOpen={isViewModalOpen}
                onClose={() => setViewModalOpen(false)}
                clientData={currentClient}
                modalType="view"
            />
            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onUpdate={handleUpdateClient}
                clientData={currentClient}
                modalType="edit"
            />
        </div>
    );
};

export default Client;