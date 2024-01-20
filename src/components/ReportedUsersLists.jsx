import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const ReportedUsersList = ({ reportedUsers }) => {
  const [searchText, setSearchText] = useState("");

  // Memoized search logic
  const filteredRows = useMemo(() => {
    const rowsWithIds = Array.isArray(reportedUsers)
      ? reportedUsers.map((row, index) => ({
          ...row,
          id: index,
        }))
      : [];

    return rowsWithIds.filter(
      (row) =>
        row.reportedTravelerId?.firstName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.reportedTravelerId?.lastName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.reportingTravelerId?.firstName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.reportingTravelerId?.lastName
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.reason.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [reportedUsers, searchText]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "reportedTraveler",
      headerName: "Reported Traveler",
      width: 300,
    },
    {
      field: "reportingTraveler",
      headerName: "Reporting Traveler",
      width: 300,
    },
    { field: "reason", headerName: "Reason", width: 300 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      valueFormatter: (params) =>
        moment(params.value).format("MMMM D, YYYY HH:mm:ss"),
    },
  ];

  const rows = filteredRows.map((row) => ({
    id: row.id,
    reportedTraveler: `${row.reportedTravelerId.firstName} ${row.reportedTravelerId.lastName}`,
    reportingTraveler: `${row.reportingTravelerId.firstName} ${row.reportingTravelerId.lastName}`,
    reason: row.reason,
    createdAt: row.createdAt,
  }));

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
};

export default ReportedUsersList;
