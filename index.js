const express = require("express");
const app = express();

// CORS header on every response
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/classify", async (req, res) => {
  const { name } = req.query;

  // 1. Missing or empty name → 400
  if (name === undefined || name === "") {
    return res.status(400).json({
      status: "error",
      message: "name query parameter is required",
    });
  }

  // 2. Non-string name → 422
  if (typeof name !== "string") {
    return res.status(422).json({
      status: "error",
      message: "name must be a string",
    });
  }

  try {
    // 3. Call Genderize API
    const response = await fetch(
      `https://api.genderize.io/?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      return res.status(502).json({
        status: "error",
        message: "Failed to fetch data from Genderize API",
      });
    }

    const apiData = await response.json();

    // 4. Edge case: no prediction available
    if (apiData.gender === null || apiData.count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }

    // 5. Process the data
    const gender = apiData.gender;
    const probability = apiData.probability;
    const sample_size = apiData.count;
    const is_confident = probability >= 0.7 && sample_size >= 100;
    const processed_at = new Date().toISOString();

    return res.status(200).json({
      status: "success",
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident,
        processed_at,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});