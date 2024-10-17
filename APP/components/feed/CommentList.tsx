"use client";

import Image from "next/image";
import { useState } from "react";

type CommentWithUser = {
  id: number | string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: number;
  user: {
    id: string;
    username: string;
    avatar: string;
    name?: string;
    surname?: string;
  };
};

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) => {
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  const user = {
    id: "currentUserId",
    imageUrl: "/noAvatar.png",
  }; // Replace with actual user data from frontend context or state

  const addOptimisticComment = (comment: CommentWithUser) => {
    setCommentState((prev) => [comment, ...prev]);
  };

  const add = () => {
    if (!user || !desc) return;

    addOptimisticComment({
      id: Math.random(),
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId: postId,
      user: {
        id: user.id,
        username: "Sending Please Wait...",
        avatar: user.imageUrl,
      },
    });
    // Simulate async behavior
    setTimeout(() => {
      setDesc("");
    }, 500);
  };

  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/emoji.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}
      <div>
        {/* COMMENT */}
        {commentState.map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* AVATAR */}
            <Image
              src={comment.user.avatar || "noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            {/* DESC */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? comment.user.name + " " + comment.user.surname
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt=""
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div>Reply</div>
              </div>
            </div>
            {/* ICON */}
            <Image
              src="/more.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
