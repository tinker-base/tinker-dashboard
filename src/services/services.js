import axios from "axios";

export const getRows = async (table) => {
  try {
    return await axios.get(
      `http://ec2-3-135-207-39.us-east-2.compute.amazonaws.com:3000/${table}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllTablesInSchema = async (schemaName = "public") => {
  try {
    return await axios.get(
      `http://ec2-3-135-207-39.us-east-2.compute.amazonaws.com:3000/rpc/tables_in_schema?schema=${schemaName}`
    );
  } catch (error) {
    return error;
  }
};

export const getAllSchemas = async () => {
  try {
    return await axios.get(
      "http://ec2-3-135-207-39.us-east-2.compute.amazonaws.com:3000/rpc/all_schemas"
    );
  } catch (error) {
    return error;
  }
};
