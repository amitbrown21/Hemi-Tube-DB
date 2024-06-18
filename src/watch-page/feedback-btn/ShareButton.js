import React from "react";
import "./Feedback.css";

const ShareButton = () => {
  return (
    <div>
      <div className="dropend">
        <button
          type="button"
          className="dropdown-toggle feedback-button"
          id="share-button"
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          aria-expanded="false"
        >
          <img src="assets/icons/share.svg" alt="share" className="icon-img" />
          Share
        </button>
        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="#">
              Menu item
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Menu item
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Menu item
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                navigator.clipboard.writeText("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
              }}
            >
              Copy link
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareButton;
