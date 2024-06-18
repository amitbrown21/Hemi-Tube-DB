import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
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

  const handleSubmit = (e) => {
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

    const videoURL = URL.createObjectURL(videoFile);
    const thumbnailURL = URL.createObjectURL(thumbnailFile);

    const newVideo = {
      id: videos.length + 1, // Ensure each video has a unique ID
      title,
      description,
      url: videoURL,
      thumbnail: thumbnailURL,
      owner: currentUser ? currentUser.username : "Unknown",
      views: "0",
      date: new Date().toLocaleDateString(),
      comments: [],
      likes: 0,
      dislikes: 0,
      duration: duration ? formatDuration(duration) : "00:00",
    };

    setVideos([...videos, newVideo]);
    setRedirect(true); // Set redirect to true to trigger navigation
  };

  if (redirect) {
    return <Navigate to="/" />; // Redirect to home page
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
