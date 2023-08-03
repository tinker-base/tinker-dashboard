import axios from "axios";

const TINKER_ADMIN_IP = "3.137.184.88";
// const TINKER_ADMIN_IP = process.env.REACT_APP_ADMIN_URL;
const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
console.log(`Build is ${process.env.NODE_ENV}`);

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

export const getRows = async (url, schema = "public", table, jwt) => {
  try {
    return await axios.get(`${protocol}://${url}:3000/${table}`, {
      headers: { Authorization: `Bearer ${jwt}`, "Accept-Profile": schema },
    });
  } catch (error) {
    return error.response;
  }
};

export const getColumns = async (url, schema, table, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/get_columns_from_table`,
      { schema_name: schema, p_table_name: table },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {}
};

export const getColumnConstraints = async (url, schema, table, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/get_column_constraints`,
      { p_schema_name: schema, p_table_name: table },
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

export const deleteTable = async (schema, tableName, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/delete_table`,
      { schema_name: schema, table_name: tableName },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};

export const editTable = async (formData, url, jwt) => {
  try {
    return axios.post(
      `${protocol}://${url}:3000/rpc/update_table_name`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.message;
  }
};

export const insertInTable = async (url, schema, tableName, rowData, jwt) => {
  return await axios.post(`${protocol}://${url}:3000/${tableName}`, rowData, {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Profile": schema },
  });
};

export const updateRowInTable = async (
  url,
  schema,
  tableName,
  rowData,
  pk,
  jwt
) => {
  return await axios.put(
    `${protocol}://${url}:3000/${tableName}?${pk.column}=eq.${pk.value}`,
    rowData,
    {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Profile": schema },
    }
  );
};

export const deleteRow = async (url, schema, tableName, pk, jwt) => {
  return await axios.delete(
    `${protocol}://${url}:3000/${tableName}?${pk.column}=eq.${pk.value}`,
    {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Profile": schema },
    }
  );
};

export const addNewColumn = async (formData, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/add_columns_to_table`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};

export const addForeignKey = async (formData, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/add_foreign_key_constraint`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};

export const createSchema = async (formData, url, jwt) => {
  try {
    return await axios.post(
      `${protocol}://${url}:3000/rpc/create_schema`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.response;
  }
};

export const addTableDescription = async (formData, url, jwt) => {
  try {
    return axios.post(
      `${protocol}://${url}:3000/rpc/add_table_comment`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.message;
  }
};

export const viewTableDescription = async (formData, url, jwt) => {
  try {
    return axios.post(
      `${protocol}://${url}:3000/rpc/view_table_description`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.message;
  }
};
// formData = {p_schema_name string, p_table_name string, new_description string}
export const updateTableDescription = async (formData, url, jwt) => {
  try {
    return axios.post(
      `${protocol}://${url}:3000/rpc/update_table_description`,
      formData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
  } catch (error) {
    return error.message;
  }
};

export const deleteColumn = async (url, tableName, columnName, jwt) => {
  return await axios.post(
    `${protocol}://${url}:3000/rpc/drop_column_from_table`,
    { table_name: tableName, column_name: columnName },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
};

export const alterColumn = async (url, alteration_commands, jwt) => {
  return await axios.post(
    `${protocol}://${url}:3000/rpc/alter_column`,
    {
      alteration_commands,
    },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
};
