import React from "react";
import { useValue } from "../../context/ContextProvider";
import { reducerCases } from "../../context/constant";

function IncommingVideoCall({ socket }) {
  const {
    state: { incommingVideoCall },
    dispatch,
  } = useValue();


  
  const acceptCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      payload: { ...IncommingVideoCall, type: "in-comming" },
    });
    socket.current.emit("accept-incomming-call", {
      id: incommingVideoCall?.id,
    });
    dispatch({
      type: reducerCases.SET_INCOMMING_VIDEO_CALL,
      payload: undefined,
    });
  };

  const rejectCall = () => {
    dispatch({ type: reducerCases.END_CALL });
    socket.current.emit("reject-video-call", { from: incommingVideoCall?.id });
  };

  return (
    <div
      className="h-24 w-80 fixed-bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start text-white p-4 drop-shadow-2xl border-icon-green border-2 py-14 bg-bgColor"
      style={{ backgroundColor: "white" }}
    >
      <div>
        <img
          src={incommingVideoCall?.profileUrl}
          alt="propic"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div style={{ color: "red" }}>{incommingVideoCall.name}</div>
        <div className=" text-xs">Incomming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button className=" bg-blue p-1 px-3" onClick={acceptCall}>
            Accept
          </button>
          <button className=" bg-blue p-1 px-3" onClick={rejectCall}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncommingVideoCall;
