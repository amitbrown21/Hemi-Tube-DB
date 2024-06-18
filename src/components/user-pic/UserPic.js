import React from "react";

const UserPic = ({ src, size }) => {
  const defaultSrc = "assets/icons/notLoggedIn.svg";
  return (
    <img
      src={src || defaultSrc}
      alt="User Profile"
      style={{ width: size, height: size, borderRadius: "50%" }}
    />
  );
};

export default UserPic;
