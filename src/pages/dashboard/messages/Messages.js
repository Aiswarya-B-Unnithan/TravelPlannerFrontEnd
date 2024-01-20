import React, { useEffect, useState } from "react";

import axios from "axios";
import ReportQueriesList from "../../../components/reportedQueryLists";
import ReportedUsersList from "../../../components/ReportedUsersLists";
import { apiRequest } from "../../../utils";
import API_URLS from "../../../utils/apiConfig";
import { useSelector } from "react-redux";

const Messages = ({ setSelectedLink, link }) => {
  const [reportedQueries, setReportedQueries] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);
  const { user } = useSelector((state) => state.user);
  // Fetch reported queries
  const fetchReportedQueries = async () => {
    try {
      const response = await apiRequest({
        url: API_URLS.REPORTED_ROOMS,
        method: "GET",
        token: user?.token,
      });
      const reportedQueries = response;
      setReportedQueries(reportedQueries);
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error("Error fetching reported queries:", error);
    }
  };

  // Fetch reported users (replace this with your actual API call)
  const fetchReportedUsers = async () => {
    try {
      const response = await apiRequest({
        url: API_URLS.REPORTED_TRAVELERS,
        method: "GET",
        token: user?.token,
      });
      const reportedUsers = response.data;
     
      setReportedUsers(reportedUsers);
    } catch (error) {
      console.error("Error fetching reported users:", error);
    }
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchReportedQueries();
    fetchReportedUsers();
  }, []);

  return (
    <div>
      <h2>Reported Queries</h2>
      <ReportQueriesList reportedQueries={reportedQueries} />
      <h2>Reported Travelers</h2>
      <ReportedUsersList reportedUsers={reportedUsers} />
    </div>
  );
};

export default Messages;
