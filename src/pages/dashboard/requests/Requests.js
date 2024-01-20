import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import REQUESTS_FROM_HOSTS from "../../../utils/apiConfig";
import moment from "moment";
import { Avatar, gridClasses } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Alert, AlertTitle } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { apiRequest } from "../../../utils";
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Requests = ({ setSelectedLink, link }) => {
  const [requests, setRequests] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector((state) => state.user);

  const [alert, setAlert] = useState({
    isOpen: false,
    severity: "success",
    message: "",
  });

  const handleRejectWithReason = async (requestId) => {
    setRowId(requestId);
    setRejectionReason("");
    setOpenDialog(true);
  };

  const handleRejectConfirmed = () => {
    handleReject(rowId, rejectionReason);
    setOpenDialog(false);
    setRejectionReason("");
  };

  const handleRejectCancelled = () => {
    setOpenDialog(false);
    setRejectionReason("");
  };
  const fetchData = async () => {
    const url = "http://localhost:8800/admin/requests";
    try {
      const res = await apiRequest({ url, method: "GET", token: user?.token });

  
      setRequests(res?.result);
    } catch (error) {
      console.error("Error fetching registration requests:", error);
    }
  };

  const handleApprove = async (requestId) => {
    const url = `http://localhost:8800/admin/approve/${requestId}`;
    try {
      const response = await apiRequest({
        url,
        method: "PUT",
        token: user?.token,
      });

      if (response.success) {
        setAlert({
          isOpen: true,
          severity: "success",
          message: `Request with ID ${requestId} has been approved.`,
        });

        fetchData();
      } else {
        setAlert({
          isOpen: true,
          severity: "error",
          message: `Failed to approve request with ID ${requestId}.`,
        });
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        severity: "error",
        message: "An unexpected error occurred while approving the request.",
      });
    }
  };

 const handleReject = async (requestId, rejectionReason) => {
   try {
     const url = `http://localhost:8800/admin/reject/${requestId}`;
     const response = await apiRequest({
       url,
       method: "PUT",
       token: user?.token,
       data: {
         adminVerification: "rejected",
         rejectionReason: rejectionReason,
       },
     });
     if (response.success) {
       setAlert({
         isOpen: true,
         severity: "success",
         message: `Request with ID ${requestId} has been rejected.`,
       });

       fetchData();
     } else {
       setAlert({
         isOpen: true,
         severity: "error",
         message: `Failed to reject request with ID ${requestId}.`,
       });
     }
   } catch (error) {
     setAlert({
       isOpen: true,
       severity: "error",
       message: "An unexpected error occurred while rejecting the request.",
     });
   }
 };


  useEffect(() => {
    setSelectedLink(link);

    // Fetch registration requests from the server
    const fetchRequests = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching registration requests:", error);
      }
    };

    fetchRequests();
  }, [setSelectedLink, link]);

  const columns = useMemo(
    () => [
      {
        field: "profileUrl",
        headerName: "Avatar",
        width: 60,
        renderCell: (params) => <Avatar src={params?.row?.profileUrl} />,
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
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        renderCell: (params) =>
          moment(params?.row?.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "uId", headerName: "UID", width: 220 },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <>
            <button onClick={() => handleApprove(params?.row?._id)}>
              Approve
            </button>
            <span style={{ margin: "0 8px" }} />
            <button onClick={() => handleRejectWithReason(params?.row?._id)}>
              Reject
            </button>
          </>
        ),
      },
    ],
    []
  );

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={requests}
        getRowId={(row) => row?._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params?.isFirstVisible ? 0 : 5,
          bottom: params?.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params?.id)}
      />
      {/* Dialog for capturing rejection reason */}
      <Dialog open={openDialog} onClose={handleRejectCancelled}>
        <DialogTitle>Provide Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Reason"
            variant="outlined"
            fullWidth
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancelled}>Cancel</Button>
          <Button onClick={handleRejectConfirmed}>Confirm</Button>
        </DialogActions>
      </Dialog>
      {alert.isOpen && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ isOpen: false })}
        >
          <AlertTitle>
            {alert.severity === "success" ? "Success" : "Error"}
          </AlertTitle>
          {alert.message}
        </Alert>
      )}
    </div>
  );
};

export default Requests;
