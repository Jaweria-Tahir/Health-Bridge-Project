const axios = require("axios");

const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL ||
  "http://127.0.0.1:8002";

const analyzeResource = async (resource) => {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/analyze`,
      {
        name: resource.name,
        description: resource.description,
        location: resource.location
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Python service error:",
      error.message
    );

    throw new Error(
      "Python resource analyzer unavailable"
    );
  }
};

module.exports = {
  analyzeResource
};