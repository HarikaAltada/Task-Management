import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostForm = ({ onNewPost }) => {
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !photo) {
      toast.error("Please provide both caption and photo.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("photo", photo);
    setLoading(true); // Set loading to true when the post submission starts
    try {
      const response = await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Post added successfully!");
        setCaption(""); // Clear the form inputs
        setPhoto(null);
        onNewPost(response.data.post); // Add the new post to the feed
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Failed to add post. Please try again.");
    }
    finally {
        setLoading(false); // Set loading to false when the request completes
      }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="mb-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Post</h2>
        <label className="block text-sm font-medium mb-2">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="Write a caption..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Photo</label>
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-[#334977] text-white px-4 py-2 mt-3 rounded"
        disabled={loading}
      >
       {loading ? "Submitting..." : "Submit Post"} 
      </button>
    </form>
  );
};

export default PostForm;
