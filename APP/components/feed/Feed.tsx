import { useEffect, useState } from 'react';
import Post from './Post';

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
      <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
        <p className="text-gray-500 animate-pulse">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col gap-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post} // Pass the entire post object
          />
        ))
      ) : (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400 text-lg">No posts found.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
