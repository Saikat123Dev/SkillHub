"use client";

import { useAuth } from "next-auth/react";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const PostInteraction = ({
  postId,

}: {
  postId: number;
  
}) => {
  const { data: session } = useAuth();
  const userId = session?.user?.id;

 


  const likeAction = () => {
    switchOptimisticLike();
    setLikeState((state) => ({
      likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
      isLiked: !state.isLiked,
    }));
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <button onClick={likeAction}>
            <Image
              src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
              width={16}
              height={16}
              alt=""
              className="cursor-pointer"
            />
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLike.likeCount}
            <span className="hidden md:inline"> Likes</span>
          </span>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/comment.png"
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {commentNumber}
            <span className="hidden md:inline"> Comments</span>
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/share.png"
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            <span className="hidden md:inline"> Share</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
