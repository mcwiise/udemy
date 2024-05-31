import { Fragment } from 'react';
import Post from './Post.jsx';
import classes from './PostList.module.css';
import { useLoaderData } from 'react-router';

function PostList(){
  const posts = useLoaderData();
  return (
    <Fragment>
      {posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map(post => <Post id={post.id} author={post.author} body={post.body}/>)}  
        </ul>
      )}

      {posts.length === 0 && (
        <div>
          <h2>There are no posts yet</h2>
          <p>Start adding some!</p>
        </div>
      )}

    </Fragment> 
  );
}

export default PostList;