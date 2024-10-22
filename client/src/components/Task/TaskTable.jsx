import { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";
import TableFilter from "../TableFilter";

const TaskTable = ({ tasks, onView, onEdit, showEdit = true }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [noTasksFound, setNoTasksFound] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "text-yellow-400 font-medium";
      case "In Progress":
        return "text-brown-400 font-medium";
      case "Delayed":
        return "text-red-800 font-medium";
      case "Done":
        return "text-green-800 font-medium";
      default:
        return "";
    }
  };

  const truncateText = (text) => {
    if (typeof text !== "string") return "";
    const words = text.split(" ");
    if (words.length > 4) {
      return `${words.slice(0, 3).join(" ")}...`;
    }
    return text;
  };

  const handleSearch = (searchTerm) => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
    setNoTasksFound(filtered.length === 0); // Update noTasksFound based on filtered length
  };

  const handleSort = (sortOrder) => {
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setFilteredTasks(sortedTasks);
    setNoTasksFound(sortedTasks.length === 0); // Update noTasksFound after sorting
  };

  return (
    <div className="overflow-x-auto">
      <TableFilter onSearch={handleSearch} onSort={handleSort} />
      {noTasksFound ? ( // Show no tasks found message
        <p className="text-gray-900 text-center mt-4">No tasks found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-5">
          <thead className="bg-gray-200 text-gray-800 uppercase text-sm font-semibold text-center">
            <tr>
              <th className="py-2 px-3 border-b border-gray-300">Project</th>
              <th className="py-2 px-3 border-b border-gray-300">Task</th>
              <th className="py-2 px-3 border-b border-gray-300">Category</th>
              <th className="py-2 px-3 border-b border-gray-300">
                Project Manager
              </th>
              <th className="py-2 px-3 border-b border-gray-300">Team Lead</th>
              <th className="py-2 px-3 border-b border-gray-300">Status</th>
              <th className="py-2 px-3 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredTasks.map((task) => (
              <tr
                key={task._id}
                className={`transition-colors duration-150 ${
                  task._id % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-3 border-b border-gray-300 text-base">
                  {truncateText(task.project?.projectName) || "N/A"}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base">
                  {truncateText(task.title) || "N/A"}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base">
                  {task.category || "N/A"}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base">
                  {truncateText(task.projectManager?.name) || "N/A"}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base">
                  {task.teamLead?.name || "N/A"}
                </td>
                <td
                  className={`py-3 px-3 border-b border-gray-300 text-base ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status || "N/A"}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-center">
                  <button
                    onClick={() => onView(task)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEye size={20} />
                  </button>
                  {showEdit && (
                    <button
                      onClick={() => onEdit && onEdit(task)} // Ensure onEdit exists before calling
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaEdit size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  showEdit: PropTypes.bool,
};

export default TaskTable;
