import fs from "fs";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Extract subtitles from video
app.post("/extract-subtitles", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  const inputVideoPath = req.file.path;
  const outputSubtitlePath = path.join(
    "uploads",
    `${Date.now()}-subtitles.vtt`
  );

  // Run FFmpeg command to extract subtitles directly
  ffmpeg(inputVideoPath)
    .output(outputSubtitlePath)
    .outputOptions(["-map 0:s:0", "-c:s webvtt"]) // Extract first subtitle stream in WebVTT format
    .on("end", () => {
      console.log("Subtitle extraction complete:", outputSubtitlePath);
      res.json({
        success: true,
        subtitlePath: `http://localhost:${port}/${outputSubtitlePath}`,
      });
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err.message);
      res.status(500).json({ success: false, error: err.message });
    })
    .run();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
