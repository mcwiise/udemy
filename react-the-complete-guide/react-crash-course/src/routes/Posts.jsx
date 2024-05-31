import { Fragment, useState } from "react";
import PostList from "../components/PostList";
import { Outlet } from "react-router-dom";

function Posts() {
  return (
    <Fragment>
      <Outlet />
      <dialog open>This is an open dialog window</dialog>
      <PostList />
    </Fragment>
  );
}

export default Posts;

export async function loader() {
  const rawResponse = await fetch("http://localhost:8080/posts");
  const response = await rawResponse.json();
  console.log(response.posts);
  return response.posts;
}
