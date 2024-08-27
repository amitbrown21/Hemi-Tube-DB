import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";

function UploadVideo({ videos, setVideos, currentUser }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [duration, setDuration] = useState(null);
  const navigate = useNavigate();

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
      };
    }
  }, [videoFile]);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnailFile) {
      alert("Video and thumbnail files are required.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", currentUser._id);  // Make sure userId is added
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("duration", duration ? formatDuration(duration) : "00:00");

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${currentUser._id}/videos`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to upload video:", errorText);
        throw new Error(errorText || "Failed to upload video");
      }

      const result = await res.json();
      console.log("Video uploaded successfully:", result);
      setVideos([...videos, result]);

      // Redirect to homepage after successful upload
      navigate('/');
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

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
                      onChange={(e) => handleFileChange(e, setVideoFile)}
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
                      onChange={(e) => handleFileChange(e, setThumbnailFile)}
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
