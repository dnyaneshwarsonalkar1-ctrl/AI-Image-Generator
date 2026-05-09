const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./key.env" });

const app = express();

app.use(cors());
app.use(express.json());

const ACCESS_KEY = process.env.UNSPLASH_KEY || process.env.UNSPLASH_ACCESS_KEY;

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!ACCESS_KEY) {
      return res.status(500).json({
        images: [],
        info: "Server missing Unsplash API key"
      });
    }

    const response = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query: prompt,
          per_page: 9
        },
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`
        }
      }
    );

    const images = response.data.results.map(
      img => img.urls.regular
    );

    res.json({
      images,
      info: `Found ${images.length} images`
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.json({
      images: [],
      info: "Error loading data"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
