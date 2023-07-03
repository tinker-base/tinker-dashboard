import axios from "axios";

export const getProjects = async () => {
  try {
    return await axios.get(
      `http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/project`
    );
  } catch (error) {
    return error.response;
  }
};

export const getRows = async (url, table) => {
  try {
    return await axios.get(`http://${url}:3000/${table}`);
  } catch (error) {
    return error.response;
  }
};

export const getAllTablesInSchema = async (url, schemaName = "public") => {
  try {
    return await axios.get(
      `http://${url}:3000/rpc/tables_in_schema?schema=${schemaName}`
    );
  } catch (error) {
    return error.response;
  }
};

export const getAllSchemas = async (url) => {
  try {
    return await axios.get(`http://${url}:3000/rpc/all_schemas`);
  } catch (error) {
    return error.response;
  }
};

export const getUser = async (credentials) => {
  try {
    return await axios.post(
      "http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/rpc/get_user",
      credentials
    );
  } catch (error) {
    return error.response;
  }
};

export const uniqueEmail = async (email, jwt) => {
  try {
    return await axios.post(
      "http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/rpc/unique_user_email",
      email,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const uniqueUsername = async (username, jwt) => {
  try {
    return await axios.post(
      "http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/rpc/unique_username",
      username,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const insertUser = async (credentials, jwt) => {
  try {
    return await axios.post(
      "http://ec2-3-137-184-88.us-east-2.compute.amazonaws.com:3000/rpc/insert_user",
      credentials,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};
