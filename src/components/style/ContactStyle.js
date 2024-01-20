
import styled from "styled-components";
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .back-button {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: 100%;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        position: relative;
        img {
          height: 3rem;
        }
        .unread-count {
          position: absolute;
          bottom: -8px;
          right: -8px;
          background-color: green;
          color: #fff;
          border-radius: 50%;
          padding: 0.2rem 0.5rem;
          font-size: 0.8rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
      ${
        "" /* &.unread {
        background-color: #00ff00;
      } */
      }
    }
    .selected {
      background-color: #9a86f3;
    }
    .unread {
      background-color: #00ff00;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;


export default Container