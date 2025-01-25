const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryconfig");
const Post = require("../model/post");

const router = express.Router();

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_posts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Create a new post
router.post("/create", upload.single("photo"), async (req, res) => {
  try {
    const { caption } = req.body;
    const photoUrl = req.file.path;

    const newPost = new Post({ caption, photoUrl });
    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Delete a post
router.delete("/:id", async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the post by ID and delete it
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
  
      res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
