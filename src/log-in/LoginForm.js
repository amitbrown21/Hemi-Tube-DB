import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="card shadow">
        <div className="card-header">
          <h2>Log In</h2>
        </div>
        <div className="card-body">
          <InputField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="floatingInput"
            placeholder="Username"
            label="Username"
            required
          />
          <InputField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="floatingPassword"
            placeholder="Password"
            label="Password"
            required
          />
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col">
              <Button type="submit" className="btn btn-primary gx-5">
                Log In
              </Button>
            </div>
            <div className="col-auto">
              <Link to="/signup">
                <Button className="btn btn-outline-primary">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;