import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import DataTable from "react-data-table-component";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State to store the selected photo URL

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Add a new post to the table
  const addNewPostToFeed = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsModalOpen(false); // Close modal after adding the post
  };
 // Handle delete post
 const deletePost = async (postId) => {
  try {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    setPosts(posts.filter((post) => post._id !== postId));
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

  // Open the photo in a larger view
  const openPhotoModal = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  // Close the photo modal
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  // Handle click outside the modal to close it
  const handleClickOutside = (event) => {
    // Close the modal if the click is outside the modal content
    if (event.target.className.includes("modal-overlay")) {
      closePhotoModal();
    }
  };

  // Define columns for the data table
  const columns = [
    {
      name: "Photo",
      selector: (row) => (
        <img
          src={row.photoUrl}
          alt="Post"
          className="w-20 h-20 object-cover rounded cursor-pointer"
          onClick={() => openPhotoModal(row.photoUrl)} // Open photo modal on click
        />
      ),
      sortable: false,
    },
    {
      name: "Caption",
      selector: (row) => row.caption,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="text-red-500 font-semibold"
          onClick={() => deletePost(row._id)} // Delete post when clicked
        >
          Delete
        </button>
      ),
    },
    // {
    //   name: "Date",
    //   selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    //   sortable: true,
    // },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between">
      <h2 className="text-xl font-bold mb-4">Feed</h2>

      {/* Add Post Button */}
      <button
        onClick={() => setIsModalOpen(true)}
         className="flex items-center px-4 py-2 bg-[#334977] text-white rounded-lg"
      >
         <span className="text-lg mr-2">+</span> Add Post
      </button>
</div>
      {/* Modal for PostForm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 float-right text-lg"
            >
              &times;
            </button>
            <PostForm onNewPost={addNewPostToFeed} />
          </div>
        </div>
      )}

      {/* Data Table for Posts */}
      <div className="mt-6">
      <div className="overflow-y-auto max-h-[600px]">
        <DataTable
          columns={columns}
          data={posts}
       
          highlightOnHover
          responsive
          striped
        />
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 modal-overlay"
          onClick={handleClickOutside} // Close on clicking outside the modal
        >
          <div className="relative bg-white p-6 rounded shadow-lg max-w-2xl w-full">
            <button
              onClick={closePhotoModal}
              className="absolute top-2 right-2 text-white text-3xl"
            >
              &times;
            </button>
            <img
              src={selectedPhoto}
              alt="Large View"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
