const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const videosController = require("../controllers/videosController");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // Limit the file size to 50MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images and videos only!");
  }
}

// Public routes
router.post("/", upload.single("profileImage"), usersController.createUser);
router.post("/login", usersController.login);
router.get("/:id", usersController.getUserById); // Made public
router.get("/:id/videos", usersController.getUserVideos); // Made public
router.get("/:id/videos/:pid", videosController.getVideoById); // Made public
router.get("/:id/videos/:pid/comments", commentController.getCommentsByVideoId); // Made public

// Protected routes
router.get("/verify-token", authMiddleware, usersController.verifyToken);
router.get("/", authMiddleware, usersController.getAllUsers);
router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, usersController.deleteUser);

// Video routes under a user
router.post(
  "/:id/videos",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  videosController.createVideo
);
router.put("/:id/videos/:pid", authMiddleware, videosController.updateVideo);
router.delete("/:id/videos/:pid", authMiddleware, videosController.deleteVideo);

// Comment routes under a video of a user
router.post(
  "/:id/videos/:pid/comments",
  authMiddleware,
  commentController.createComment
);
router.get(
  "/:id/videos/:pid/comments/:commentId",
  authMiddleware,
  commentController.getCommentById
);
router.put(
  "/:id/videos/:pid/comments/:commentId",
  authMiddleware,
  commentController.updateComment
);
router.delete(
  "/:id/videos/:pid/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
