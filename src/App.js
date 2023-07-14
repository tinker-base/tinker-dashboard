import "./App.css";
import React from "react";
import { TableEditor } from "./components/table_editor";
import { Routes, Route } from "react-router-dom";
import { Projects } from "./components/projects";
import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { PageNotFound } from "./components/page_not_found";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Projects />} />
          <Route path="projects" element={<Projects />} />
          <Route path="users" element={<h1>Users List</h1>} />
        </Route>
        <Route path="dashboard/projects/:project" element={<Dashboard />}>
          <Route path="tables/:table" element={<TableEditor />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
