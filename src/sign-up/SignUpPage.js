import React, { useState } from "react";
import "./SignUpPage.css";
import { Navigate, Link } from "react-router-dom";

function SignUpPage() {
  const [confirmation, setConfirmation] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    gender: "",
    profilePicture: "default_picture_url",
    subscribers: "0",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmation !== newUser.password) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Submitting user data:", newUser);
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create user:", errorText);
        throw new Error(errorText || "Failed to create user");
      }

      const result = await res.json();
      console.log("User created successfully:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user");
    }
  };

  if (isSubmitted) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="signup-page">
      <div className="logo-signup">
        <Link to="/" className="logo-signup" onClick={handleLogoClick}>
          <img
            src="assets/img/youtube_logo.png"
            alt="YouTube Logo"
            className="p-2"
          />
        </Link>
      </div>
      <div className="sign-up-container">
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
                  className="signup-input form-control"
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
                  className="signup-input form-control"
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
                  className="signup-input form-control"
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
                  className="form-control"
                  placeholder="Password"
                  required
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  pattern="(?=.*\d)((?=.*[a-z])|(?=.*[A-Z])).{8,20}"
                />
                <div className="signup-input pass-req">
                  Your password must be 8-20 characters long, and contain both
                  (and only) English letters and numbers.
                </div>
              </div>
              <div className="col-12">
                <label className="form-label"></label>
                <input
                  type="password"
                  className="signup-input form-control"
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
                  className="signup-input form-select"
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
              <div className="col-12">
                <label className="form-label"></label>
                <input
                  type="text"
                  className="signup-input form-control"
                  placeholder="Profile Picture URL"
                  required
                  name="profilePicture"
                  value={newUser.profilePicture}
                  onChange={handleChange}
                />
              </div>
              {error && <div className="col-12 error text-danger">{error}</div>}
              <div className="col-12">
                <button type="submit" className="btn btn-primary sign-button">
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
