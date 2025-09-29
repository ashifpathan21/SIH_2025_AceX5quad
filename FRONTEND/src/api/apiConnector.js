import axios from "axios";

const axiosInstance = axios.create({});

export const apiConnector = async (method, url, bodyData, headers, params) => {
  try {
    const response = await axiosInstance({
      method: method.toLowerCase(),
      url,
      data: bodyData,
      headers: headers || {},
      params,
    });
    return response;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Let the caller handle it
  }
};
