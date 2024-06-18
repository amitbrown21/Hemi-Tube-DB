import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";

function EditVideo({ currentVideo, videos, setVideos }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (thumbnailFile && !imageFormats.includes(thumbnailFile.type)) {
      alert("Only PNG, JPG, and JPEG images are allowed.");
      return;
    }

    const thumbnailURL = thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : currentVideo.thumbnail;

    const updatedVideo = {
      ...currentVideo,
      title,
      description,
      thumbnail: thumbnailURL,
    };

    const updatedVideos = videos.map((video) =>
      video.id === currentVideo.id ? updatedVideo : video
    );

    setVideos(updatedVideos);
    setRedirect(true);
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
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Button type="submit" className="btn btn-primary">
                Update Video
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;
