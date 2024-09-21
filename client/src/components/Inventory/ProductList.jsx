import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import Api from "../../common/index";
import { FaEdit, FaEye } from "react-icons/fa";
import Spinner from "../Spinner";
import TableFilter from "../TableFilter";

const ProductList = ({ onEditClick, onDelete, onViewClick }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(Api.getProduct.url)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data); // Initialize filtered products
        } else {
          console.error("Unexpected data structure:", response.data);
          setError("Unexpected data structure");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Error fetching products");
      })
      .finally(() => setLoading(false));
  }, [onDelete]);

  // const handleDelete = (productId) => {
  //     axios.delete(Api.deleteProduct.url.replace(':id', productId))
  //         .then(() => {
  //             setProducts(products.filter(product => product._id !== productId));
  //             onDelete();
  //         })
  //         .catch(error => console.error(error));
  // };

  const handleSearch = (searchTerm) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (order) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return order === "asc"
        ? nameA < nameB
          ? -1
          : 1
        : nameA > nameB
        ? -1
        : 1;
    });
    setFilteredProducts(sorted);
  };

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <TableFilter onSearch={handleSearch} onSort={handleSort} />{" "}
      {/* Add TableFilter here */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-5">
        <thead className="bg-gray-200 text-gray-800 uppercase text-sm font-semibold">
          <tr>
            <th className="py-2 px-3 border-b border-gray-300">Name</th>
            <th className="py-2 px-3 border-b border-gray-300">Quantity</th>
            <th className="py-2 px-3 border-b border-gray-300">Category</th>
            <th className="py-2 px-3 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="py-3 px-3 border-b border-gray-300 text-base text-center">
                  {product.name}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base text-center">
                  {product.quantity}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-base text-center">
                  {product.category}
                </td>
                <td className="py-3 px-3 border-b border-gray-300 text-center">
                  <button
                    className="text-green-500 hover:text-green-700 mr-2"
                    onClick={() => onEditClick(product)}
                  >
                    <FaEdit size={20} />
                  </button>
                  {/* <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrash size={20} />
                  </button> */}
                  <button
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => onViewClick(product)}
                  >
                    <FaEye size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ProductList.propTypes = {
  onEditClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
};

export default ProductList;
