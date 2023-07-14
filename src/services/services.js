import axios from "axios";

const TINKER_ADMIN_IP = process.env.REACT_APP_ADMIN_URL;
// const TINKER_ADMIN_IP = "3.137.184.88";

// Admin DB Routes

export const fetchAllProjects = async (jwt) => {
  try {
    return await axios.get(`https://${TINKER_ADMIN_IP}:3000/projects`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const login = async (credentials) => {
  try {
    return await axios.post(
      `https://${TINKER_ADMIN_IP}:3000/rpc/login`,
      credentials
    );
  } catch (error) {
    return error.response;
  }
};

export const uniqueEmail = async (email, jwt) => {
  try {
    return await axios.post(
      `https://${TINKER_ADMIN_IP}:3000/rpc/unique_user_email`,
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
      `https://${TINKER_ADMIN_IP}:3000/rpc/unique_username`,
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
      `https://${TINKER_ADMIN_IP}:3000/rpc/insert_user`,
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
      `https://${TINKER_ADMIN_IP}:3000/rpc/get_username`,
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
    return await axios.get(`https://${url}:3000/${table}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const getColumns = async (url, table, jwt) => {
  try {
    return await axios.post(
      `https://${url}:3000/rpc/get_columns_from_table`,
      { p_table_name: table },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {}
};

export const getAllTablesInSchema = async (url, schemaName = "public", jwt) => {
  try {
    return await axios.get(
      `https://${url}:3000/rpc/tables_in_schema?schema=${schemaName}`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const getAllSchemas = async (url, jwt) => {
  try {
    return await axios.get(`https://${url}:3000/rpc/all_schemas`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const createNewTable = async (formData, url, jwt) => {
  try {
    return await axios.post(`https://${url}:3000/rpc/create_table`, formData, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const deleteTable = async (tableName, url, jwt) => {
  try {
    return await axios.post(
      `https://${url}:3000/rpc/delete_table`,
      { table_name: tableName },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};
