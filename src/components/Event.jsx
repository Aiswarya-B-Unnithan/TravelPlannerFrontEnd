// Event.jsx
import React from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const Event = ({ event, deleteEvent }) => {
  const { user } = useSelector((state) => state.user);
  const isCurrentUser = event?.organizer?._id === user?._id;

  const handleDelete = () => {
    // Call the deletePost function when the delete icon is clicked
    deleteEvent(event?._id);
  };
// Calculate the days left for the upcoming event
  const currentDate = new Date();
  const eventDate = new Date(event?.date);
  const daysLeft = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));
  return (
    <div className="py-4 border-b border-[#66666645]" key={event?._id}>
      <h3 className="text-lg font-medium text-ascent-1 relative">
        {event?.title}
        {""} {""}{" "}
        <span className="text-xs text-white-400 absolute top-0 right-0">
          {" "}
          {daysLeft > 0 ? `Days Left: ${daysLeft}` : "Event has already passed"}
        </span>
      </h3>
      <p className="text-sm text-ascent-2">{event?.organizer?.firstName}</p>
      <p className="text-sm text-ascent-2">{event?.description}</p>
      <p className="text-sm text-ascent-2">Location: {event?.location}</p>
      <p className="text-sm text-ascent-2">
        Date: {new Date(event?.date).toLocaleDateString()}
      </p>
      <p className="text-sm text-ascent-2"></p>
      {isCurrentUser && (
        <button
          className="text-ascent-1 hover:text-red-500 ml-auto mt-2"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};

export default Event;
