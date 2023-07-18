import axios from "axios";

const TINKER_ADMIN_IP =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_TINKER_ADMIN_URL
    : process.env.REACT_APP_ADMIN_URL;
const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
console.log(`Build is ${process.env.NODE_ENV}`);
// const TINKER_ADMIN_IP = "3.137.184.88";

// Admin DB Routes

export const fetchAllProjects = async (jwt) => {
  try {
    return await axios.get(`${protocol}://${TINKER_ADMIN_IP}:3000/projects`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const login = async (credentials) => {
  try {
    return await axios.post(
      `${protocol}://${TINKER_ADMIN_IP}:3000/rpc/login`,
      credentials
    );
  } catch (error) {
    return error.response;
  }
};

export const uniqueEmail = async (email, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${TINKER_ADMIN_IP}:3000/rpc/unique_user_email`,
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
      `${protocol}://${TINKER_ADMIN_IP}:3000/rpc/unique_username`,
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
      `${protocol}://${TINKER_ADMIN_IP}:3000/rpc/insert_user`,
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
      `${protocol}://${TINKER_ADMIN_IP}:3000/rpc/get_username`,
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
    return await axios.get(`${protocol}://${url}:3000/${table}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const getColumns = async (url, table, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/get_columns_from_table`,
      { p_table_name: table },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {}
};

export const getColumnConstraints = async (url, table, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/get_column_constraints`,
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
      `${protocol}://${url}:3000/rpc/tables_in_schema?schema=${schemaName}`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
  } catch (error) {
    return error.response;
  }
};

export const getAllSchemas = async (url, jwt) => {
  try {
    return await axios.get(`${protocol}://${url}:3000/rpc/all_schemas`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
  } catch (error) {
    return error.response;
  }
};

export const createNewTable = async (formData, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/create_table`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};

export const deleteTable = async (tableName, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}s://${url}:3000/rpc/delete_table`,
      { table_name: tableName },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};
export const insertInTable = async (url, tableName, rowData, jwt) => {
  return await axios.post(`${protocol}://${url}:3000/${tableName}`, rowData, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export const updateRowInTable = async (url, tableName, rowData, pk, jwt) => {
  return await axios.put(
    `${protocol}://${url}:3000/${tableName}?${pk.column}=eq.${pk.value}`,
    rowData,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
};

export const deleteRow = async (url, tableName, pk, jwt) => {
  return await axios.delete(
    `http://${url}:3000/${tableName}?${pk.column}=eq.${pk.value}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
};
