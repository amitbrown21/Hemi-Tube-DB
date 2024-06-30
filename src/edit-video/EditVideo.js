import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";

function EditVideo({ currentVideo, videos, setVideos, currentUser }) {
  const [title, setTitle] = useState(currentVideo.title);
  const [description, setDescription] = useState(currentVideo.description);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (currentVideo) {
      setTitle(currentVideo.title);
      setDescription(currentVideo.description);
    }
  }, [currentVideo]);

  // Check if the current user is the owner of the video
  if (!currentUser || currentUser._id !== currentVideo.owner) {
    return <Navigate to="/" />;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailFile(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVideo = {
      ...currentVideo,
      title,
      description,
      thumbnail: thumbnailFile || currentVideo.thumbnail,
    };

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`, // Add the token
          },
          body: JSON.stringify(updatedVideo),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update video");
      }

      const result = await res.json();
      const updatedVideos = videos.map((video) =>
        video._id === currentVideo._id ? result : video
      );

      setVideos(updatedVideos);
      setRedirect(true);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`, // Add the token
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete video");
      }

      const updatedVideos = videos.filter(
        (video) => video._id !== currentVideo._id
      );

      setVideos(updatedVideos);
      setRedirect(true);
    } catch (error) {
      console.error("Error deleting video:", error);
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
              <h3>Edit Video</h3>
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
                      <h4 className="d-inline-block">Thumbnail</h4>
                      <span>(png/jpg/jpeg)</span>
                      <br />
                    </div>
                    <FileInputField
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Button type="submit" className="btn btn-primary">
                Update Video
              </Button>
              <Button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Video
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;