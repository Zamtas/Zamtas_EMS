import { useState } from "react";
import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";

const TableFilter = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onSort(value);
  };

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="flex items-center border border-gray-300 bg-white rounded-md shadow-sm">
        <FaSearch className="text-gray-400 mx-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name..."
          className="flex-grow px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
        />
      </div>
      <select
        value={sortOrder}
        onChange={handleSort}
        className="ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
      >
        <option value="asc">Sort A-Z</option>
        <option value="desc">Sort Z-A</option>
      </select>
    </div>
  );
};

TableFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
};

export default TableFilter;
