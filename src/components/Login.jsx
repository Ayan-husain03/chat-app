import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  // handle input function
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({ ...credentials, [name]: value });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <form
      className="max-w-xl mx-auto mt-24 md:shadow-2xl p-4 rounded-xl"
      onSubmit={(e) => (
        handleUserLogin(e, credentials),
        setCredentials({ email: "", password: "" })
      )}
    >
      <h1 className="text-4xl mb-5 font-semibold">Login </h1>
      <div className="my-5">
        <label className="text-xl font-medium my-3 block">Email</label>
        <input
          type="email"
          name="email"
          className="input  w-full border border-blue-400 bg-transparent"
          placeholder="enter email"
          value={credentials.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="my-5">
        <label className="text-xl font-medium my-3 block">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          className="input w-full border border-blue-400 bg-transparent"
          placeholder="enter password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <label className="my-3 flex items-center gap-3" htmlFor="showPassword">
          <input
            id="showPassword"
            type={`checkbox`}
            className="checkbox checkbox-primary"
            value={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span>{showPassword ? "hide" : "show"} password</span>
        </label>
      </div>
      <button className="btn btn-primary text-xl w-full my-5">Login</button>
      <p>
        Don't have an Account?{" "}
        <Link className="font-medium text-blue-600" to={"/signup"}>
          Signup
        </Link>
      </p>
      {/* <div>
        <Logout className="btn btn-primary w-full" />
      </div> */}
    </form>
  );
};

export default Login;
