// ProfileCardStyles.js
import styled from "styled-components";

export const ReportIcon = styled.div`
  cursor: pointer;
  margin-left: 10px;
  color: ${(props) => (props.isReportDialogOpen ? "#0f52b6" : "inherit")};
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff34;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: ${(props) => (props.isDropdownOpen ? "flex" : "none")};
  flex-direction: column;
  gap: 0.5rem;
  z-index: 999;
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const InputStyle = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
  color: ${(props) => (props.isDarkTheme ? "#fff" : "#000")};
  background-color: ${(props) => (props.isDarkTheme ? "#333" : "#fff")};
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
