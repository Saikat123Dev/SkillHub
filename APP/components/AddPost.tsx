"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import axios from "axios";

const AddPost = () => {
  const user = useCurrentUser();
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc.trim()) {
      alert("Post cannot be empty");
      return;
    }

    try {
      setLoading(true);
      // Making a POST request to the API endpoint to create a post
      const response = await axios.post("/api/posts/create", {
        content: desc,
        userId: user?.id, // Assuming `useCurrentUser` provides user data
      });

      if (response.status === 201) {
        alert("Post created successfully");
        setDesc(""); // Clear the textarea after successful post
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.profilePic || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form className="flex gap-4" onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={loading} // Disable input while loading
          ></textarea>
          <div>
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton disabled={loading} /> {/* Disable button while loading */}
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addimage.png" alt="" width={20} height={20} />
            Photo
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" alt="" width={20} height={20} />
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" alt="" width={20} height={20} />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width={20} height={20} />
            Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
