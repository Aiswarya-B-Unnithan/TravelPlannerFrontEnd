import moment from "moment";
import React, { useState } from "react";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonCheck,
  BsPersonFillAdd,
} from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import { CiCircleMore, CiLocationOn } from "react-icons/ci";
import { MdReportProblem } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile } from "../redux/userSlice";
import { apiRequest, sendFriendRequest, unfriend } from "../utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URLS from "../utils/apiConfig";
import {
  ReportIcon,
  DropdownContent,
  DropdownContainer,
  InputStyle,
  ButtonContainer,
} from "../components/style/ProfileCardStyles";
const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const isDarkTheme = theme === "dark";
  const [errMsg, setErrMsg] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const friendIDs = data.friends.map((friend) => friend._id.toString());
  const areFriends = friendIDs.includes(user?._id);

  const isOwnProfile = data?._id === user?._id;
  const isFriend = areFriends && !isOwnProfile;
  const shouldShowReportIcon = !isOwnProfile;
  const [reportReason, setReportReason] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openReportDialog = () => {
    setIsReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setIsReportDialogOpen(false);
    setReportReason(""); // Clear the report reason when closing the dialog
  };

  const handleReport = async (reason) => {
    const reportingUserToken = data?.token;

    const res = await apiRequest({
      url: API_URLS.REPORT_TRAVELER,
      data: { reportedUser: user?._id, reason: reportReason },
      token: reportingUserToken,
      method: "POST",
    });
    if (res.status === false) {
      toast.error(res.message); 
    } else {
      toast.success("Report submitted successfully"); // Display a success toast
    }
    closeReportDialog();
  };

  const handleUnfriend = async (req, res) => {
    setErrMsg("");
    const result = await unfriend(data?._id, user?._id, data?.token);

    if (result.success === false) {
      toast.error(res.message);
    } else {
      toast.success("Unfriend successfully");
    }
  };

  return (
    <div>
      <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
          <Link className="flex gap-2" to={"/profile/" + user?._id}>
            <img
              src={user?.profileUrl ?? NoProfile}
              alt={user?.email}
              className="w-14 h-14 object-cover rounded-full"
            />
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium text-ascent-1">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="text-ascent-2">
                {user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>
          <DropdownContainer>
            <CiCircleMore
              onClick={toggleDropdown}
              size={20}
              className="text-[#0f52b6] cursor-pointer"
            />
            <DropdownContent isDropdownOpen={isDropdownOpen}>
              {!isOwnProfile && (
                <>
                  {isFriend ? (
                    <BsPersonCheck
                      size={20}
                      style={{ color: "red" }}
                      className="text-[#0f52b6]"
                      title="Friends"
                      onClick={handleUnfriend}
                    />
                  ) : (
                    <button
                      className="bg-[#0444a430] text-sm text-white p-1 rounded"
                      onClick={() => sendFriendRequest(data.token, user?._id)}
                    >
                      <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                    </button>
                  )}
                </>
              )}
              {isOwnProfile && (
                <MdEditDocument
                  size={20}
                  className="text-[#0f52b6] cursor-pointer"
                  title="Update Profile"
                  onClick={() => dispatch(UpdateProfile(true))}
                />
              )}

              <DropdownContent isReportDialogOpen={isReportDialogOpen}>
                <InputStyle
                  type="text"
                  placeholder="Enter your report reason..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  isDarkTheme={isDarkTheme}
                />
                <ButtonContainer>
                  <button onClick={handleReport}>Submit</button>
                  <button onClick={closeReportDialog}>Cancel</button>
                </ButtonContainer>
              </DropdownContent>
              {!isOwnProfile && (
                <ReportIcon
                  isReportDialogOpen={isReportDialogOpen}
                  onClick={openReportDialog}
                >
                  <MdReportProblem
                    size={22}
                    className="text-[#0f52b6] cursor-pointer"
                    title="Report Profile"
                    style={{ paddingLeft: "0px" }}
                  />
                </ReportIcon>
              )}
            </DropdownContent>
          </DropdownContainer>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <div className="flex gap-2 items-center text-ascent-2">
            <CiLocationOn className="text-xl text-ascent-1" />
            <span>{user?.location ?? "Add Location"}</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsBriefcase className=" text-lg text-ascent-1" />
            <span>{user?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
          <p className="text-xl text-ascent-1 font-semibold">
            {user?.friends?.length} Friends
          </p>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Who viewed your profile</span>
            <span className="text-ascent-1 text-lg">{user?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {user?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className="flex items-center justify-between">
            <span className="text-ascent-2">Joined</span>
            <span className="text-ascent-1 text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 py-4 pb-6">
          <p className="text-ascent-1 text-lg font-semibold">Social Profiles</p>

          <div className="flex gap-2 items-center text-ascent-2">
            <BsInstagram className=" text-xl text-ascent-1" />
            <span>Instagram</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <FaTwitterSquare className=" text-xl text-ascent-1" />
            <span>Twitter</span>
          </div>
          <div className="flex gap-2 items-center text-ascent-2">
            <BsFacebook className=" text-xl text-ascent-1" />
            <span>Facebook</span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileCard;
