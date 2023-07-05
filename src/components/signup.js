import React from "react";
import { Link } from "react-router-dom";
import validator from "validator";

export const Signup = ({ onSubmit }) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");
  const [jwtSecret, setJWTSecret] = React.useState("");
  const [validCredentials, setValidCredentials] = React.useState({
    email: null,
    username: null,
  });
  const [usernameBlur, setUsernameBlur] = React.useState(false);
  const [emailBlur, setEmailBlur] = React.useState(false);
  const [passwordBlur, setPasswordBlur] = React.useState(false);
  const [rePasswordBlur, setRePasswordBlur] = React.useState(false);
  const [jwtSecretBlur, setJWTSecretBlur] = React.useState(false);

  const inputsFilled = () => {
    return (
      validator.isEmail(email) &&
      password.length !== 0 &&
      password === rePassword
    );
  };

  const formReset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRePassword("");
    setUsernameBlur(false);
    setEmailBlur(false);
    setPasswordBlur(false);
    setRePasswordBlur(false);
    setJWTSecretBlur(false);
    setValidCredentials(null);
  };

  const EmailErrorMessage = () => {
    if (emailBlur) {
      if (validator.isEmail(email) === false) {
        return (
          <span className="text-red-600 text-xs">Please enter valid email</span>
        );
      } else if (validCredentials.email === false) {
        return (
          <span className="text-red-600 text-xs">Email is already in use</span>
        );
      }
    }
    return <span className="opacity-0">hidden</span>;
  };

  const UsernameErrorMessage = () => {
    if (usernameBlur) {
      if (username.length === 0) {
        return (
          <span className="text-red-600 text-xs">Username cannot be empty</span>
        );
      } else if (validCredentials.username === false) {
        return (
          <span className="text-red-600 text-xs">
            Username is already taken
          </span>
        );
      }
    }
    return <span className="opacity-0">hidden</span>;
  };

  return (
    <div className=" bg-indigo-500 h-screen w-screen flex justify-center ali">
      <div className="  flex flex-1 flex-col justify-center  sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
          <h2 className="mt-6 text-center text-6xl font-bold leading-9 tracking-tight text-indigo-50">
            TINKER
          </h2>
        </div>

        <div className="m-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (inputsFilled()) {
                  try {
                    const validations = await onSubmit({
                      email: email.toLowerCase(),
                      password,
                      username,
                      jwtSecret,
                      role: "admin",
                    });
                    setValidCredentials(validations);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setEmailBlur(true);
                  setPasswordBlur(true);
                }
                if (
                  validCredentials.email === true &&
                  validCredentials.username === true
                ) {
                  formReset();
                }
              }}
            >
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  User Name
                </label>
                <div className="mt-2">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setUsernameBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <UsernameErrorMessage />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <EmailErrorMessage />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {password.length === 0 && passwordBlur ? (
                    <span className="text-red-600 text-xs">
                      Password cannot be empty
                    </span>
                  ) : (
                    <span className="opacity-0">hidden</span>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="re-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="re-password"
                    name="re-password"
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    onBlur={() => setRePasswordBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {password !== rePassword ||
                  (rePassword.length === 0 && rePasswordBlur) ? (
                    password !== rePassword ? (
                      <span className="text-red-600 text-xs">
                        Passwords do not match
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs">
                        Password cannot be empty
                      </span>
                    )
                  ) : (
                    <span className="opacity-0">hidden</span>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="jwtSecret"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  JWT Secret
                </label>
                <div className="mt-2">
                  <input
                    id="jwtSecret"
                    name="jwtSecret"
                    type="text"
                    autoComplete="off"
                    value={jwtSecret}
                    onChange={(e) => setJWTSecret(e.target.value)}
                    onBlur={() => setJWTSecretBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {jwtSecret.length === 0 && jwtSecretBlur ? (
                    <span className="text-red-600 text-xs">
                      JWT Secret cannot be empty
                    </span>
                  ) : (
                    <span className="opacity-0">hidden</span>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
