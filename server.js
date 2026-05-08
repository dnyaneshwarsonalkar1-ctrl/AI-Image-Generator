const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());


const UNSPLASH_KEY = "te-Vef50U-hNwj87NtNTFmAF64B4j-rIcNdsfNzmwdE";

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    // 🖼 Real images from Unsplash
    const imageRes = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: prompt,
          per_page: 4
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      }
    );

    const images = imageRes.data.results.map(img => img.urls.small);

    // 📚 Wikipedia
    const wikiRes = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(prompt)}`,
      {
        headers: { "User-Agent": "ImageApp" }
      }
    );

    res.json({
      images: images,
      info: wikiRes.data.extract
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    res.json({
      images: [],
      info: "Error loading data"
    });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
