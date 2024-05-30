import { FaBook } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { auth } from "../api";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, refetchAuthState } = useAuth();

  console.log(isAuthenticated);
  return (
    <header className="flex justify-between items-center h-14 shadow-md p-3 w-full">
      <div className="flex justify-center items-center gap-x-1">
        <FaBook />
        <h1 className="font-semibold">YourLogbook</h1>
      </div>
      <ul className="flex gap-x-3">
        <li className="cursor-pointer hover:bg-black hover:text-white p-2 rounded-md">
          About
        </li>

        {isAuthenticated ? (
          <li className="cursor-pointer hover:bg-black hover:text-white p-2 rounded-md">
            <Link to="/logout">Logout</Link>
          </li>
        ) : (
          ""
        )}
      </ul>
    </header>
  );
};

export default Header;
