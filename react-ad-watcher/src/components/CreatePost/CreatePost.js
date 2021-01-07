import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import "./CreatePost.css";
import { withRouter } from "react-router-dom";

function CreatePost(props) {
  const [posts, setPost] = useState({
    title: "",
    body: "",
    filepath: "",
    credits: "",
  });
  const { title, body, filepath, credits } = posts;

  const [file, setFile] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(posts);
    if (title !== "" && body !== "" && filepath !== "" && credits !== "") {
      Axios.post("/api/posts/create", posts, {
        headers: {
          Authorization: `${props.authToken}`,
        },
      })
        .then((res) => {
          console.log(res);
          props.history.push("/");
        })
        .catch((err) => {
          props.history.push("/");
          alert("Error Posting Please Try Again Later");
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="card border-0 shadow p-10 cd-bg">
        <div className="card-body p-10 mt-5 cd-body">
          <Form className="create-post-form p-3" onSubmit={submitHandler}>
            <h1>
              <span className="font-weight-bold">Create Post</span>
            </h1>
            <FormGroup>
              <Label className="mt-3">Title</Label>
              <Input
                type="text"
                value={title}
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
                value={body}
                placeholder="Description"
                onChange={(e) => {
                  setPost({ ...posts, body: e.target.value });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="mt-3">Set Credits</Label>
              <Input
                type="numer"
                value={credits}
                placeholder="minimum 50"
                min="50"
                onChange={(e) => {
                  setPost({ ...posts, credits: e.target.value });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Input
                style={{ background: "white" }}
                type="file"
                className="mt-4 mb-3"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              ></Input>
              <Button
                className="mt-4 mb-3"
                style={{ maxWidth: "200px", margin: "7px" }}
                onClick={async (e) => {
                  e.preventDefault();
                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await Axios.post("/upload", formData, {
                      headers: {
                        Authorization: `${props.authToken}`,
                        "Content-Type": "multipart/form-data",
                      },
                    });
                    console.log(res.data);
                    setPost({
                      ...posts,
                      filepath: res.data.filePath,
                    });
                    alert("FILE UPLOADED Succesfully");
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                UPLOAD
              </Button>

              <Button className="mt-4 mb-3" type="submit">
                CREATE
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    </>
  );
}

export default withRouter(CreatePost);
