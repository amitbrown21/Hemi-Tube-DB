import React, { useState } from "react";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import FileInputField from "../components/FileinputField";
import Button from "../components/Button";
import CompactVideo from "../watch-page/compact-video/CompactVideo";

function UploadForm({ onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

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
      title,
      description,
      videoURL,
      thumbnail: thumbnailURL,
      owner: "Owner Name",
      views: "0 views",
      date: new Date().toLocaleDateString(),
    };

    setVideoPreview(newVideo);
    onUpload(title, description, videoFile, thumbnailFile);
    e.target.reset();
  };

  return (
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
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="Title"
                  required
                />
                <TextareaField
                  label="Description (required)"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  placeholder="Description"
                  required
                  style={{ height: "100px" }}
                />
                <div className="mb-3">
                  <div className="mb-2">
                    <h4 className="d-inline-block">Video</h4>
                    <span>(mp4)</span>
                    <br></br>
                  </div>
                  <FileInputField
                    accept="video/mp4"
                    onChange={(e) => {
                      setVideoFile(e.target.files[0]);
                    }}
                    required
                  />
                </div>
                <div className="mb-3">
                  <div className="mb-2">
                    <h4 className="d-inline-block">Thumbnail</h4>
                    <span>(png/jpg/jpeg)</span>
                    <br></br>
                  </div>
                  <FileInputField
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      setThumbnailFile(e.target.files[0]);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="offset-md-2 col-5">
                {videoPreview && (
                  <>
                    <h3 className="mb-4">Video Preview</h3>
                    <div style={{ transform: "scale(1.4)" }} className="pt-2">
                      <CompactVideo src={videoPreview} />
                    </div>
                    <h5 className="text-success mt-4">Video Uploaded!</h5>
                  </>
                )}
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
  );
}

export default UploadForm;
