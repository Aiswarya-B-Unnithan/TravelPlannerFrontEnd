import React,{useEffect} from 'react'
import { useValue } from '../../context/ContextProvider';
import Container from './Container';

export default function VideoCall({ socket }) {
   
  const {
    state: {currentUser, videoCall },
    dispatch,
  } = useValue();

  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket?.current?.emit("out-going-video-call", {
        to: videoCall?._id,
        from: {
          id: currentUser?._id,
          profileUrl: currentUser?.profileUrl,
          name: currentUser?.firstName,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall])
  
  return (
    <Container data={videoCall} socket={socket}/>
  );
}
