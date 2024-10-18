import Image from "next/image";
import Comments from "./Comments";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";

type AuthorType = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  profilePic: string;
};

type FeedPostType = {
  id: string;
  content: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: AuthorType;
  img?: string;
  likes: { userId: string }[];
  _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
  const userId = "currentUserId"; // Replace with actual user ID from frontend context or state

  return (
    <div className="flex flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.author.profilePic }
            width={40}
            height={40}
            alt={post.author.name || "User Avatar"}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {post.author.name || post.author.username || "Unknown User"}
          </span>
        </div>
        {userId === post.author.id && <PostInfo postId={post.id} />}
      </div>
      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            <Image
              src={post.img}
              fill
              className="object-cover rounded-md"
              alt="Post image"
            />
          </div>
        )}
        <p>{post.content || "No description available"}</p>
      </div>
      {/* INTERACTION */}
      {/* <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          // likes={post.likes.map((like) => like.userId)}
          // commentNumber={post._count.comments}
        />
      </Suspense> */}
      {/* <Suspense fallback="Loading...">
        <Comments postId={post.id} />
      </Suspense> */}
    </div>
  );
};

export default Post;
