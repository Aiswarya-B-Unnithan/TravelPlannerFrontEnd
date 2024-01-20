const RenderedMessageContent = ({ message }) => {
   const content = getMessageContent(message);

    if (content) {
   
      switch (message?.type) {
        case "text":
          return <p>{content?.text}</p>;
        case "image":
          const imagePathParts = content?.imageUrl?.split(/[\\/]/);
          const relativeImagePath = imagePathParts?.slice(-2).join("/");
          return (
            <div>
              <p>Image Message</p>
              <img src={relativeImagePath} alt="pic" />
            </div>
          );

        case "file":
          return (
            <div>
              <p>File Recevied</p>
              <a
                href={content.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </a>
            </div>
          );
        case "voice":
       
          const voicePathParts = content?.voiceUrl.split(/[\\/]/);
          const relativeVoicePath = voicePathParts.slice(-2).join("/");
          return (
            <div>
              <p>Voice Message</p>
              <audio controls>
                <source src={relativeVoicePath} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        case "video":
          const videoPathParts = content?.videoUrl?.split(/[\\/]/);
          const relativeVideoPath = videoPathParts?.slice(-2).join("/");
          return (
            <div>
              <p>Video Message</p>
              <video width="320" height="240" controls>
                <source src={relativeVideoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );

        default:
          return null;
      }
    }

    return null;
  }
export default RenderedMessageContent;
  const getMessageContent = (message) => {
    switch (message.type) {
      case "text":
        return { text: message.content.text };
      case "image":
        return { imageUrl: message.content.imageUrl };
      case "file":
        return {
          fileUrl: message.content.fileUrl,
          fileName: message.content.fileName,
        };
      case "voice":
        return {
          voiceUrl: message?.content?.voiceUrl,
        };
      case "video":
        return { videoUrl: message?.content?.videoUrl };
      default:
        return null;
    }
  };