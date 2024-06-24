import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";

function UploadVideo({ videos, setVideos, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [duration, setDuration] = useState(null);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    } else {
      return `${mins}:${String(secs).padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    if (videoFile) {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(videoFile);
      videoElement.onloadedmetadata = () => {
        setDuration(videoElement.duration);
        URL.revokeObjectURL(videoElement.src);
      };
    }
  }, [videoFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const videoFormats = ["video/mp4"];
    const imageFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (!videoFormats.includes(videoFile.type)) {
      alert("Only MP4 videos are allowed.");
      return;
    }

    if (!imageFormats.includes(thumbnailFile.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("duration", duration ? formatDuration(duration) : "00:00");

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("/api/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      const newVideo = response.data;
      setVideos([...videos, newVideo]);
      setRedirect(true);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video. Please try again.");
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-3">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header">
              <h3>Upload Video</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 col-sm-5">
                  <InputField
                    label="Title (required)"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                  />
                  <TextareaField
                    label="Description (required)"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                    style={{ height: "100px" }}
                  />
                  <div className="mb-3">
                    <div className="mb-2">
                      <h4 className="d-inline-block">Video</h4>
                      <span>(mp4)</span>
                      <br />
                    </div>
                    <FileInputField
                      accept="video/mp4"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="mb-2">
                      <h4 className="d-inline-block">Thumbnail</h4>
                      <span>(png/jpg/jpeg)</span>
                      <br />
                    </div>
                    <FileInputField
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Button type="submit" className="btn btn-primary">
                Upload Video
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;