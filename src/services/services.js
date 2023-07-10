import axios from "axios";

const MOCK_TINKER_ADMIN_IP = "www.tinker.com";

// Admin DB Routes

export const getProjects = async (jwt) => {
  try {
    return await axios.get(`http://${MOCK_TINKER_ADMIN_IP}:3000/projects`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const login = async (credentials) => {
  try {
    return await axios.post(
      `http://${MOCK_TINKER_ADMIN_IP}:3000/rpc/login`,
      credentials
    );
  } catch (error) {
    return error.response;
  }
};

export const uniqueEmail = async (email, jwt) => {
  try {
    return await axios.post(
      `http://${MOCK_TINKER_ADMIN_IP}:3000/rpc/unique_user_email`,
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
      `http://${MOCK_TINKER_ADMIN_IP}:3000/rpc/unique_username`,
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
      `http://${MOCK_TINKER_ADMIN_IP}:3000/rpc/insert_user`,
      credentials,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const getUsername = async (credentials, jwt) => {
  try {
    return await axios.post(
      `http://${MOCK_TINKER_ADMIN_IP}:3000/rpc/get_username`,
      credentials,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

// Project specific routes

export const getRows = async (url, table, jwt) => {
  try {
    return await axios.get(`http://${url}:3000/${table}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const getAllTablesInSchema = async (url, schemaName = "public", jwt) => {
  try {
    return await axios.get(
      `http://${url}:3000/rpc/tables_in_schema?schema=${schemaName}`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const getAllSchemas = async (url, jwt) => {
  try {
    return await axios.get(`http://${url}:3000/rpc/all_schemas`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};
