import React from "react";
import { useQuery } from "react-query";
import * as api from "../api";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, error, isLoading } = useQuery(
    "authenticatedUser",
    api.getAuthenticatedUserDetails
  );

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-20 text-red-500">
        Error loading user details
      </div>
    );

  const name = data && data.length > 0 ? data[0]["name"] : null;
  const dob = data && data.length > 0 ? data[0]["date_of_birth"] : null;
  const gender = data && data.length > 0 ? data[0]["gender"] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Profile
        </h1>
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 gap-4 border p-6 rounded-md bg-gray-50 w-full">
            <div className="font-semibold text-gray-700">Name:</div>
            <div className="text-gray-900">{name}</div>
            <div className="font-semibold text-gray-700">Date of birth:</div>
            <div className="text-gray-900">{dob}</div>
            <div className="font-semibold text-gray-700">Gender:</div>
            <div className="text-gray-900">{gender}</div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/class/logbook/courses">
            <button className="py-2 px-6 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Logbook
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
