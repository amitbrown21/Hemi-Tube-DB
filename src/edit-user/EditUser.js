import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EditUser.css"; // Import the CSS file for dark mode styles

function EditUser({ currentUser, setCurrentUser, isDarkMode }) {
  const [userData, setUserData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    password: "",
    profilePicture: currentUser?.profilePicture || "assets/img/user_icon.ico",
  });
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUserData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevState) => ({
          ...prevState,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,20}$/;

    if (userData.password && !passwordRegex.test(userData.password)) {
      setError(
        "Password must be 8-20 characters long and contain both letters and numbers."
      );
      return;
    }

    if (userData.password && userData.password !== confirmation) {
      setError("Passwords do not match");
      return;
    }

    const updateData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePicture: userData.profilePicture,
    };

    if (userData.password) {
      updateData.password = userData.password;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update user:", errorText);
        throw new Error(errorText || "Failed to update user");
      }

      const updatedUser = await res.json();
      setCurrentUser(updatedUser);
      navigate(`/channel/${updatedUser._id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  return (
    <div className={`container mt-3 ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`edit-user-card ${isDarkMode ? "dark-mode" : ""}`}>
            <div
              className={`edit-user-card-header ${
                isDarkMode ? "dark-mode" : ""
              }`}
            >
              <h3>Edit User</h3>
            </div>
            <div
              className={`edit-user-card-body ${isDarkMode ? "dark-mode" : ""}`}
            >
              <form onSubmit={handleSubmit}>
                <InputField
                  label="First Name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  pattern="(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,20}"
                />
                <div>
                  Your password must be 8-20 characters long, and contain both
                  (and only) English letters and numbers.
                </div>
                <InputField
                  label="Confirm Password"
                  name="confirmation"
                  type="password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="Confirm Password"
                />
                <div className="mb-3">
                  <div className="mb-2">
                    <h4 className="d-inline-block">Profile Picture</h4>
                    <span>(png/jpg/jpeg)</span>
                    <br />
                  </div>
                  <FileInputField
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                  />
                </div>
                {error && <div className="text-danger">{error}</div>}
                <Button type="submit" className="btn btn-primary mt-3">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
