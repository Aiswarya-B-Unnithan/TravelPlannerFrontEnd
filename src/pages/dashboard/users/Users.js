import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, TextField, Typography, gridClasses } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useValue } from "../../../context/ContextProvider";
import { getHostUsers } from "../../../actions/user";
import moment from "moment";
import { grey } from "@mui/material/colors";
import UsersActions from "./UsersActions";

const Users = ({ setSelectedLink, link }) => {
  const {
    state: { rooms, hostUsers, currentUser },
    dispatch,
  } = useValue();
  //------------------------------>
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
 const [searchText, setSearchText] = useState("");
  //------------------------------>
  useEffect(() => {
    setSelectedLink(link);
    if (hostUsers?.length === 0) getHostUsers(dispatch, currentUser);
  }, []);

  //------------------------------>
  const filteredHostUsers = useMemo(() => {
    return hostUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [hostUsers, searchText]);
  //------------------------------>
  const columns = useMemo(
    () => [
      {
        field: "profileUrl",
        headerName: "Avatar",
        width: 60,
        renderCell: (params) => <Avatar src={params.row.profileUrl} />,
        sortable: false,
        filterable: false,
      },
      { field: "firstName", headerName: "Name", width: 170 },
      { field: "email", headerName: "Email", width: 200 },
      {
        field: "role",
        headerName: "Role",
        width: 100,
      },
      {
        field: "Active",
        headerName: "Active",
        width: 100,
        type: "boolean",
        editable: currentUser?.role === "Admin",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "uId", headerName: "uId", width: 220 },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    []
  );
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Manage Users
      </Typography>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <DataGrid
        columns={columns}
        rows={filteredHostUsers}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default Users;
