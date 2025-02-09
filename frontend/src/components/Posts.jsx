import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  // Provide a fallback to avoid 'undefined' errors

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available or loading...</p>  // Placeholder for no posts or loading state
      )}
    </div>
  );
};

export default Posts;
