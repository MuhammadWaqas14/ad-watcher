import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import "./Welcome.css";
import { withRouter } from "react-router-dom";

function Welcome(props) {
  const [posts, setPosts] = useState([]);
  const fetchData = async () => {
    await Axios.get("/api/posts/all", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setPosts(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
        props.history.push("/login");
        alert("something went wrong please login again");
      });
  };
  useEffect(() => {
    fetchData();
  });
  return (
    <div className="posts-home">
      <Button
        style={{ maxWidth: "200px", margin: "7px" }}
        className="btn-dark"
        onClick={() => {
          props.history.push("/create-post");
        }}
      >
        Create Post
      </Button>
      <Button
        style={{ maxWidth: "200px", margin: "7px" }}
        className="btn-dark"
        onClick={() => {
          props.setLoggedIn(false);
          props.setSignUpCall(false);
          props.setAuth("");
          props.history.push("/login");
        }}
      >
        Log Out
      </Button>
      {posts.length !== 0 ? (
        <ul>
          {posts.map((post) => (
            <li
              key={post._id}
              style={{
                listStyle: "none",
              }}
            >
              <div className="container">
                <Card
                  className="post-card"
                  style={{
                    background: "rgba(180,180,180,0.9",
                  }}
                >
                  <CardBody>
                    <CardTitle tag="h4">{post.author}</CardTitle>
                    <CardSubtitle
                      tag="h6"
                      className="mt-2 mb-2 "
                      style={{ textColor: "gray" }}
                    >
                      CREDITS: {post.credits}
                    </CardSubtitle>

                    <CardText>{post.body}</CardText>
                  </CardBody>
                  <CardImg
                    className="image-fluid"
                    style={{
                      maxHeight: "800px",
                    }}
                    width="auto"
                    height="100%"
                    src={post.filepath}
                    alt="productimagehere"
                  />

                  <Button className="btn-block btn-dark">Watch Ad</Button>
                </Card>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Card
          className="post-card"
          style={{
            background: "rgba(180,180,180,0.9",
          }}
        >
          <CardBody>
            <CardTitle tag="h4">NO POSTS TO DISPLAY</CardTitle>
            <CardSubtitle
              tag="h6"
              className="mt-2 mb-2 "
              style={{ textColor: "gray" }}
            >
              Create a post of your own by clicking create post
            </CardSubtitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default withRouter(Welcome);
