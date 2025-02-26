import React from "react";
import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router";

const Signup = () => {
  const { handleUserRegister } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  // create user function
  const createuser = (e) => {
    e.preventDefault();
    handleUserRegister(credentials);
  };
  return (
    <form className="max-w-xl p-4 rounded-xl mx-auto mt-10">
      <h1 className="font-semibold text-4xl my-4">Signup</h1>
      <div className="my-5">
        <label className="text-xl font-medium my-3 block">Name</label>
        <input
          type="text"
          placeholder="enter username"
          name="username"
          className="input w-full border border-blue-600 bg-transparent"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="my-5">
        <label className="text-xl font-medium my-3 block">Email</label>
        <input
          type="email"
          placeholder="enter email"
          name="email"
          className="input w-full border border-blue-600 bg-transparent"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="my-5">
        <label className="text-xl font-medium my-3 block">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="enter password"
          className="input w-full border border-blue-600 bg-transparent"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      <label htmlFor="show" className="flex items-center gap-3">
        <input
          id="show"
          type="checkbox"
          className="checkbox checkbox-primary"
          value={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <span className="">{showPassword ? "hide" : "show"} password</span>
      </label>
      <button
        className="btn btn-primary text-xl w-full my-5"
        onClick={createuser}
      >
        signup
      </button>
      <p>
        Already have an account{" "}
        <Link className="text-blue-700 font-medium" to={"/login"}>
          login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
