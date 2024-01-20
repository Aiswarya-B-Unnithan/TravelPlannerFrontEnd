import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import ReportedRoomActions from "../pages/dashboard/rooms/reportedRoomActions";

const ReportQueriesList = ({ reportedQueries }) => {
 

  const rowsWithIds = Array.isArray(reportedQueries)
    ? reportedQueries.map((row, index) => ({
        ...row,
        id: index,
      }))
    : [];


  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    {
      field: "roomId.uName",
      headerName: "Host Name",
      width: 150,
      renderCell: (params) => {
        const uName = params?.row?.roomId?.uName;
       
        return <p>{uName}</p>;
      },
    },
    {
      field: "roomId.title",
      headerName: "Room Title",
      width: 200,
      renderCell: (params) => {
        const title = params?.row?.roomId?.title;
   
        return <p>{title}</p>;
      },
    },

    {
      field: "roomId.images",
      headerName: "Room Images",
      width: 200,
      renderCell: (params) => {
        const images = params?.row?.roomId?.images;
       
        return images && images.length > 0 ? (
          <img
            src={images[0]}
            alt="RoomImage"
            style={{ width: "100%", height: "100%" }}
          />
        ) : null;
      },
    },

    {
      field: "reportedUser.firstName",
      headerName: "Reported User",
      width: 150,
      valueGetter: (params) => params?.row?.reportedUser?.firstName,
    },
    { field: "reason", headerName: "Report Reason", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => <ReportedRoomActions {...{ params }} />,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rowsWithIds}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        
      />
    </div>
  );
};

export default ReportQueriesList;
