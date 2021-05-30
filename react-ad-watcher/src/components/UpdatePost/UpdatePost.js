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
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    credits: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      errors.title !== "" &&
      errors.description !== "" &&
      posts.filepath !== "" &&
      errors.credits !== ""
    ) {
      await Axios.patch(`/api/posts/update/${posts._id}`, posts, {
        headers: {
          Authorization: `${props.authToken}`,
        },
      })
        .then((res) => {
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
          props.setAuth("");
          props.histroy.push("/login");
        });
    }
  }, [posts, postId, props]);

  return (
    <>
      <div className="container card-containercp">
        <div className="card shadow mt-5">
          <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n2 mr-n2 mb-n1 text-center">
            <span>Update Post</span>
          </h1>
          <Form className="create-post-form p-3" onSubmit={submitHandler}>
            {error && (
              <span
                className="font-weight-bold alert-danger"
                style={{ color: "red" }}
              >
                ERROR Check Upload Details!
              </span>
            )}
            <FormGroup>
              <Label className="mt-3">Title</Label>
              <Input
                type="text"
                value={posts.title ? posts.title : "Title"}
                placeholder="Title"
                onChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setErrors({ ...errors, title: "Title required* " });
                  } else {
                    setErrors({ ...errors, title: "" });
                  }
                  setPost({ ...posts, title: e.target.value.trim() });
                }}
              />
              {errors && errors.title !== "" && (
                <label className="alert-danger mt-2">{errors.title}</label>
              )}
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
                  if (e.target.value.trim() === "") {
                    setErrors({
                      ...errors,
                      description: "Description required* ",
                    });
                  } else {
                    setErrors({ ...errors, description: "" });
                  }
                  setPost({ ...posts, body: e.target.value.trim() });
                }}
              />
              {errors && errors.description !== "" && (
                <label className="alert-danger mt-2">
                  {errors.description}
                </label>
              )}
            </FormGroup>
            <FormGroup>
              <Label className="mt-3">Set Credits</Label>
              <Input
                type="number"
                value={posts.credits ? parseInt(posts.credits) : "Credits"}
                placeholder="Enter Credits to be divided"
                onChange={(e) => {
                  if (
                    e.target.value.toString().trim() === "" ||
                    e.target.value % 5 !== 0 ||
                    e.target.value < 50
                  ) {
                    setErrors({
                      ...errors,
                      credits:
                        "Invalid Credits minimum 50 & multiples of 5 required* ",
                    });
                  } else {
                    setErrors({ ...errors, credits: "" });
                  }
                  setPost({ ...posts, credits: e.target.value });
                }}
              />
              {errors && errors.credits !== "" && (
                <label className="alert-danger mt-2">{errors.credits}</label>
              )}
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
              <Button className="btn btn-info mt-4 mb-3" type="submit">
                Update
              </Button>
              <Button
                className=" btn btn-info mt-4 mb-3 ml-4"
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
