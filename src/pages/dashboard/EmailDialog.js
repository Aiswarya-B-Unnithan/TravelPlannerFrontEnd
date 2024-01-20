import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const EmailDialog = ({ open, onClose, onSend }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleSend = () => {
   
    if (recipientEmail && emailContent) {
      onSend({ recipientEmail, emailContent });
      setEmailContent("")
      setRecipientEmail("")
      onClose();
    } else {
     console.log("Something went wrong")
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Email Dialog</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend}>Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;
