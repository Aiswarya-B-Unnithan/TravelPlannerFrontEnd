import React, { useState } from "react";
import { NoProfile } from "../assets";
import { Link } from "react-router-dom";

const FriendsCard = ({ friends }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredFriends = friends?.filter((friend) =>
    friend.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
        <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
          <span> Friends</span>
          <span>{filteredFriends?.length}</span>
        </div>

        {/* Search Box */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search friends"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-full px-4 py-2 border border-[#66666645]"
          />
        </div>

        <div className="w-full flex flex-col gap-4 pt-4">
          {filteredFriends?.map((friend) => (
            <Link
              to={"/profile/" + friend?._id}
              key={friend?._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={friend?.profileUrl ?? NoProfile}
                alt={friend?.firstName}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex-1 ">
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {friend?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;
