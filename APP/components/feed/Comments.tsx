import Image from "next/image";
import CommentList from "./CommentList";

const Comments = async ({ postId }: { postId: number }) => {
  // Assuming you fetch comments here, replace the below line with your actual fetch logic
  const comments = await fetchComments(postId); // Replace with your actual data fetching function

  return (
    <div>
      {/* WRITE */}
      <CommentList comments={comments} postId={postId} />
    </div>
  );
};

export default Comments;

// Example fetch function (replace this with actual implementation)
async function fetchComments(postId: number) {
  // Replace this with your actual fetching logic
  return [
    {
      id: 1,
      desc: "This is a comment",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
      postId,
      user: {
        id: "user1",
        username: "User One",
        avatar: "/avatar1.png",
      },
    },
  ];
}
