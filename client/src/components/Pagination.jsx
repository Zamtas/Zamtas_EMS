import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const getVisiblePageNumbers = () => {
        if (totalPages <= maxVisiblePages) {
            return pageNumbers;
        }

        const halfVisible = Math.floor(maxVisiblePages / 2);
        let start = currentPage - halfVisible;
        let end = currentPage + halfVisible;

        if (start < 1) {
            start = 1;
            end = maxVisiblePages;
        }

        if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisiblePages + 1;
        }

        const visiblePages = pageNumbers.slice(start - 1, end);

        if (start > 1) {
            visiblePages.unshift('...');
        }
        if (end < totalPages) {
            visiblePages.push('...');
        }

        return visiblePages;
    };

    return (
        <nav className="flex justify-center items-center mt-6">
            <ul className="flex items-center space-x-2">
                <li>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft />
                    </button>
                </li>
                {getVisiblePageNumbers().map((number, index) => (
                    <li key={index}>
                        {number === '...' ? (
                            <span className="px-3 py-1">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(number)}
                                className={`px-3 py-1 rounded-md ${currentPage === number
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {number}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;