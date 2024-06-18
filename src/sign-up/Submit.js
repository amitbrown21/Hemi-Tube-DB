import React, { useState } from "react";

function SignUpForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        pattern="(?=.*\d)(?=.*[a-z]).{8,20}"
      />
      <input type="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="gender" />
    </form>
  );
}

function Submit() {
  const handleSubmit = (formData) => {
    console.log("Form submitted with data:", formData);
  };

  return <SignUpForm onSubmit={handleSubmit} />;
}

export default Submit;
