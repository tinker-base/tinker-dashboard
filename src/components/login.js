import React from "react";
import { Link } from "react-router-dom";
import validator from "validator";

import { ReactComponent as TinkerLogo } from "../images/SVG Vector Files/tinker_logo.svg";
import { FunctionContexts } from "../utils/fetch_handlers";

export const Login = () => {
  const { handleLogin } = React.useContext(FunctionContexts);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [validCredentials, setValidCredentials] = React.useState(null);
  const [emailBlur, setEmailBlur] = React.useState(false);
  const [passwordBlur, setPasswordBlur] = React.useState(false);

  const inputsFilled = () => {
    return email.length !== 0 || password.length !== 0;
  };

  const formReset = () => {
    setEmail("");
    setPassword("");
    setEmailBlur(false);
    setPasswordBlur(false);
    setValidCredentials(null);
  };

  const EmailErrorMessage = () => {
    if (emailBlur) {
      if (validator.isEmail(email) === false) {
        return (
          <span className="text-red-600 text-xs">Please enter valid email</span>
        );
      } else if (validCredentials === false) {
        return (
          <span className="text-red-600 text-xs">
            Invalid Email and/or Password
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
          <div className="flex justify-center content-center gap-6">
            <TinkerLogo className="h-20 w-auto" />
            <h2 className="self-end pb-2 text-6xl font-bold leading-9 tracking-wide text-indigo-50">
              TINKER
            </h2>
          </div>
        </div>

        <div className="m-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                if (inputsFilled()) {
                  try {
                    const validation = await handleLogin({
                      email: email.toLowerCase(),
                      password: password,
                    });
                    setValidCredentials(!!validation.token);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setEmailBlur(true);
                  setPasswordBlur(true);
                }
                if (validCredentials) {
                  formReset();
                }
              }}
            >
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordBlur(true)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {(password.length === 0 && passwordBlur) ||
                  validCredentials === false ? (
                    validCredentials === false ? (
                      <span className="text-red-600 text-xs">
                        Invalid Email and/or Password
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

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="/"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div> */}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                to="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
