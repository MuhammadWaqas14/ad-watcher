import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardImg,
} from "reactstrap";
import { Player, BigPlayButton, Shortcut } from "video-react";

import Axios from "axios";
import "./UpdatePost.css";
import { withRouter } from "react-router-dom";

function UpdatePost(props) {
  var url = window.location.pathname;
  var postId = url.substring(url.lastIndexOf("/") + 1);

  const [posts, setPost] = useState({
    _id: "",
    title: "",
    body: "",
    credits: "",
    filepath: "",
  });
  const [error, setError] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(posts);
    if (
      posts.title !== "" &&
      posts.body !== "" &&
      posts.filepath !== "" &&
      posts.credits !== ""
    ) {
      await Axios.patch(`/api/posts/update/${posts._id}`, posts, {
        headers: {
          Authorization: `${props.authToken}`,
        },
      })
        .then((res) => {
          console.log(res);
          props.history.push("/");
        })
        .catch((err) => {
          setError(true);
          props.history.push("/");
          alert("Error Updating Please Try Again Later");
          console.log(err);
        });
    } else {
      setError(true);
    }
  };
  const backHandler = (e) => {
    e.preventDefault();
    props.history.push("/");
  };
  useEffect(() => {
    if (posts._id === "") {
      Axios.get(`/api/posts/post/${postId}`, {
        headers: {
          Authorization: `${props.authToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((res) => {
          setPost(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [posts, postId, props.authToken]);

  return (
    <>
      <div className="card border-0 shadow p-10 cd-bg">
        <div className="card-body p-10 mt-5 cd-body">
          <Form className="create-post-form p-3" onSubmit={submitHandler}>
            <h1>
              <span className="font-weight-bold">Create Post</span>
            </h1>
            {error && (
              <span
                className="font-weight-bold mt-6 mb-6"
                style={{ color: "red" }}
              >
                ERROR CHECK Upload Details!
              </span>
            )}
            <FormGroup>
              <Label className="mt-3">Title</Label>
              <Input
                type="text"
                value={posts.title ? posts.title : "Title"}
                placeholder="Title"
                onChange={(e) => {
                  setPost({ ...posts, title: e.target.value });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label className="mt-2" for="description">
                Description
              </Label>
              <Input
                type="textarea"
                value={posts.body ? posts.body : "Post Description"}
                placeholder="Description"
                onChange={(e) => {
                  setPost({ ...posts, body: e.target.value });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="mt-3">Set Credits</Label>
              <Input
                type="number"
                value={posts.credits ? parseInt(posts.credits) : "Credits"}
                placeholder="Enter Credits to be divided"
                onChange={(e) => {
                  setPost({ ...posts, credits: e.target.value });
                }}
              />
            </FormGroup>
            <Card>
              {posts.filepath !== "" && posts.filepath.indexOf("video") >= 0 ? (
                <>
                  <Player
                    contextMenu="none"
                    id="postContent"
                    playsInLine
                    src={posts.filepath !== "" ? posts.filepath : ""}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <BigPlayButton position="center" />
                    <Shortcut clickable={false} dblclickable={false} />
                  </Player>
                </>
              ) : (
                <CardImg
                  className="image-fluid"
                  style={{
                    maxHeight: "800px",
                  }}
                  width="auto"
                  height="100%"
                  src={posts.filepath !== "" ? posts.filepath : ""}
                  alt="productimagehere"
                />
              )}
            </Card>
            <FormGroup>
              <Button className="mt-4 mb-3" type="submit">
                Update
              </Button>
              <Button
                className="mt-4 mb-3 ml-4"
                type="back"
                onClick={backHandler}
              >
                Back
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    </>
  );
}

export default withRouter(UpdatePost);
