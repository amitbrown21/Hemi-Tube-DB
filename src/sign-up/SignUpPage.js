import React, { useState } from "react";
import "./SignUpPage.css";
import { Navigate, Link } from "react-router-dom";

function SignUpPage({ users, setUsers, isDarkMode }) {
  const [confirmation, setConfirmation] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    gender: "",
    profilePicture: "",
    subscribers: "0",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const imageFormats = ["image/png", "image/jpeg", "image/jpg"];

  const handleLogoClick = () => {
    <Navigate to="/" />;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onConfirmation = (e) => {
    const { value } = e.target;
    setConfirmation(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !imageFormats.includes(file.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed.");
      setNewUser((prevState) => ({
        ...prevState,
        profilePicture: "",
      }));
    } else {
      setNewUser((prevState) => ({
        ...prevState,
        profilePicture: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmation !== newUser.password) {
      setError("Passwords do not match");
      return;
    }

    const newUserWithId = {
      ...newUser,
      profilePicture: newUser.profilePicture
        ? URL.createObjectURL(newUser.profilePicture)
        : "assets/icons/notLoggedIn.svg",
      id: users.length + 1,
    };

    setUsers([...users, newUserWithId]);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="signup-page">
      <div className="logo-signup">
        <Link to="/" className="logo-signup" onClick={handleLogoClick}>
          <img src="assets/img/youtube_logo.png" alt="YouTube Logo" className="p-2" />
        </Link>
      </div>
      <div className={`sign-up-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="card text-center">
          <div className="card-header">
            <h1 className="heading">Create a new account</h1>
            Or else..
          </div>
          <div className="card-body">
            <form className="row gt-6" onSubmit={handleSubmit}>
              <div className="col-6">
                <label className="form-label"></label>

                <input
                  type="text"
                  className={`signup-input form-control ${isDarkMode ? "dark-mode" : ""}`}
                  placeholder="First name"
                  required
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className={`signup-input form-control ${isDarkMode ? "dark-mode" : ""}`}
                  placeholder="Last name"
                  required
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label"></label>

                <input
                  type="text"
                  className={`signup-input form-control ${isDarkMode ? "dark-mode" : ""}`}
                  placeholder="Username"
                  required
                  name="username"
                  value={newUser.username}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label"></label>

                <input
                  type="password"
                  className={`form-control ${isDarkMode ? "dark-mode" : ""}`}
                  placeholder="Password"
                  required
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  pattern="(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,20}"
                />
                <div className="signup-input pass-req">
                  Your password must be 8-20 characters long, and contain both (and only) English letters and numbers.
                </div>
              </div>
              <div className="col-12">
                <label className="form-label"></label>

                <input
                  type="password"
                  className={`signup-input form-control ${isDarkMode ? "dark-mode" : ""}`}
                  placeholder="Password confirmation"
                  required
                  name="confirmation"
                  value={confirmation}
                  onChange={onConfirmation}
                />
              </div>
              <div className="col-4">
                <label className="form-label"></label>

                <select
                  className={`signup-input form-select ${isDarkMode ? "dark-mode" : ""}`}
                  name="gender"
                  value={newUser.gender}
                  onChange={handleChange}
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="rather not say">Rather not say</option>
                </select>
              </div>
              <div className="col-8">
                <label htmlFor="formFile" className="form-label">
                  Profile Picture (PNG, JPG, JPEG)
                </label>
                <input
                  className={`form-control ${isDarkMode ? "dark-mode" : ""}`}
                  type="file"
                  id="formFile"
                  name="profilePicture"
                  accept="image/png, image/jpeg, image/jpg"
                  required
                  onChange={handleFileChange}
                />
              </div>
              {error && <div className="col-12 error text-danger">{error}</div>}
              <div className="col-12">
                <button type="submit" className={`btn btn-primary sign-button ${isDarkMode ? "dark-mode" : ""}`}>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
