import React from "react";
import NavBar from "./NavBar";
import { toast, ToastContainer } from "react-toastify";

const PreHomePage = ({adminVerification,email}) => {

  
const handleReapply= async()=>{
  const res = await fetch("http://localhost:8800/host/reapply", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email:email
    }),
  });
  
 

}
  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-md">
          <h1 className="text-3xl font-semibold mb-4">Account Verification</h1>
          {adminVerification === "rejected" ? (
            <>
              <p className="text-red-500 mb-6">
                Your account registration has been rejected by admin. You can
                reapply for registration if you want.
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                // Handle reapply logic here
                onClick={handleReapply}
              >
                Reapply
              </button>
            </>
          ) : (
            <p className="text-gray-600 mb-6">
              Your account registration is under verification. You can use our
              website after admin verification. Thank you for your patience.
            </p>
          )}
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default PreHomePage;
