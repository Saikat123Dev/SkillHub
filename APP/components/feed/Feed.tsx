import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { Code, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Post = ({ post }) => {
  const user = useCurrentUser();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      toast.error("Please login to connect with developers");
      return;
    }
    try {
      setIsConnecting(true);
      console.log(post);

      const response = await axios.post("/api/connect/member/request", {
        receiverId: post.author.id,
        senderId: user.id,
        projectDescription: post.description,
        groupname: post.group.grpname,
        groupId: post.group.id,
        postId: post.id
      });

      console.log("response:--> ", response);

      if (response.status === 201 || response.status === 200) {
        toast.success("Connection request sent successfully!");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send connection request";
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header with user info */}
        <div className="flex items-center space-x-4 mb-4">
          {post.author.image ? (
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 text-gray-500">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{post.group.grpname || 'No Group'}</p>
          </div>
          {user?.id !== post.author.id && (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>

        {/* Post content */}
        <div className="space-y-4">
          <p className="text-gray-700">{post.description}</p>

          {/* Tech stack */}
          {post.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  <Code className="w-4 h-4 inline-block mr-1" />
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Looking for */}
          {post.looking?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.looking.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-full w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 text-center">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id || post.group.id} post={post} />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
