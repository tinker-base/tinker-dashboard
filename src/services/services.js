import axios from "axios";

export const getProjects = async () => {
  try {
    return await axios.get(
      `http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/project`
    );
  } catch (error) {
    return error;
  }
};

export const getRows = async (url, table) => {
  try {
    return await axios.get(`http://${url}:3000/${table}`);
  } catch (error) {
    return error;
  }
};

export const getAllTablesInSchema = async (url, schemaName = "public") => {
  try {
    return await axios.get(
      `http://${url}:3000/rpc/tables_in_schema?schema=${schemaName}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllSchemas = async (url) => {
  try {
    return await axios.get(`http://${url}:3000/rpc/all_schemas`);
  } catch (error) {
    return error;
  }
};

export const checkUser = async (credentials) => {
  try {
    return await axios.post(
      "http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/rpc/check_user",
      credentials
    );
  } catch (error) {
    return error;
  }
};
