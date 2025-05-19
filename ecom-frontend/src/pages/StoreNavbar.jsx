import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

const StoreNavbar = () => {
  const redirect = useNavigate();
  const userMethods = useUser();

  const handleLogout = async () => {
    const logout = await userMethods.logout();
    if (logout) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      redirect("/");
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6 text-lg font-medium">
          <Link to="/employeeBoard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/manageProducts" className="hover:underline">
            Products
          </Link>
          <Link to="/allCheckouts" className="hover:underline">
            Checkouts
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default StoreNavbar;
