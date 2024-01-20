import styled from "styled-components";
import { MdMic } from "react-icons/md";
import { FaMicrophoneSlash } from "react-icons/fa";

const RecordButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const RecordActionButton = styled.button`
  background-color: ${(props) => (props.active ? "#dcf8c6" : "#fff")};
  padding: 10px;
  border: none;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#a3e3a3" : "#e5e5e5")};
  }
`;

const MicIcon = styled(MdMic)`
  font-size: 24px;
  color: ${(props) => (props.active ? "#4caf50" : "#000")};
`;

const StopIcon = styled(FaMicrophoneSlash)`
  font-size: 24px;
  color: #f44336;
`;

const RecordButtons = ({ onStartRecording, onStopRecording, isRecording }) => {
  return (
    <RecordButton>
      <RecordActionButton onClick={onStartRecording} active={!isRecording}>
        Start<MicIcon active={!isRecording} />
      </RecordActionButton>
      <RecordActionButton onClick={onStopRecording} active={isRecording}>
        Stop<StopIcon />
      </RecordActionButton>
    </RecordButton>
  );
};

export default RecordButtons;
