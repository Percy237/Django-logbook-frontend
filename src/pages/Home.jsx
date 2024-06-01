import React from "react";
import { useQuery } from "react-query";
import * as api from "../api";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, error, isLoading } = useQuery(
    "authenticatedUser",
    api.getAuthenticatedUserDetails
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user details</div>;

  return (
    <div>
      <Link to="/class/logbook/courses">Logbook</Link>
    </div>
  );
};

export default Home;
