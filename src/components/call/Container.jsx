import React, { useState } from "react";
import { useValue } from "../../context/ContextProvider";
import { MdOutlineCall, MdOutlineCallEnd } from "react-icons/md";
import { reducerCases } from "../../context/constant";

export default function Container({ data, socket }) {

  const {
    state: {
      currentUser,
      videoCall,
      voiceCall,
      incommingVideoCall,
      incommingVoiceCall,
    },
    dispatch,
  } = useValue();
  const [callAccepted, setCallAccepted] = useState(false);

const endCall=()=>{
    dispatch({type:reducerCases.END_CALL})
}

  return (
    <div className=" border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-black">
      <div className="flex flex-col gap-3 items-center ">
        <span className="text-5xl">{data.firstName}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On Going  Call"
            : "Calling"}
        </span>
      </div>
      {!callAccepted && data.callType === "audio" && (
        <div className="my-24">
          <img
            src={data.profileUrl}
            alt="propic"
            height={300}
            width={300}
            className=" rounded-full"
          />
        </div>
      )}
      <div className="h-16 w-16 bg-blue flex items-center rounded-full">
<MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall}/>
      </div>
    </div>
  );
}
