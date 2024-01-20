
import styled from "styled-components";
const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: #080420;
  padding: 1rem;

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji,
    .record-button,
    .file-input-label {
      display: flex;
      align-items: center;
      cursor: pointer; /* Add cursor style here */

      .file-icon,
      .image-icon,
      .mic-icon {
        /* Add mic-icon style here */
        font-size: 1.5rem;
        margin-right: 0.5rem;
        cursor: pointer; /* Add cursor style here */
      }

      .file-input {
        display: none;
      }
    }
  }

  .attachment-button {
    position: relative;

    button {
      padding: 0.3rem 1rem;
      border-radius: 2rem;
      background-color: #9a86f3;
      border: none;
      color: white;
      cursor: pointer; /* Add cursor style here */
    }

    .attachment-options {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #ffffff34;
      border-radius: 0.5rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .file-icon,
      .image-icon {
        font-size: 1.5rem;
        margin-right: 0.5rem;
        cursor: pointer; /* Add cursor style here */
      }

      .file-input {
        display: none;
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .input-container {
      button {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 480px) {
    .button-container {
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;

      .emoji,
      .record-button,
      .file-input-label {
        margin: 0.5rem;
      }
    }
  }
`;
export default Container