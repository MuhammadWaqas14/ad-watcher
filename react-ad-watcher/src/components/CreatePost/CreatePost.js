import React, { useState, useCallback, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Progress from "./Progress";
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
  const [error, setError] = useState(false);
  const { title, body, filepath, credits } = posts;
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [submitButtonState, setSubmitButtonState] = useState(true);
  const [wallet, setWallet] = useState();
  const [newWallet, setNewWallet] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const fetchWallet = useCallback(async () => {
    await Axios.get("/api/wallets", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
        setNewWallet(res.data[0]);
      })
      .catch((err) => {
        props.setAuth("");
        props.histroy.push("/login");
      });
  }, [props]);
  useEffect(() => {
    if (props.authToken === "") {
      props.history.push("/login");
    }
  }, [props]);
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);
  useEffect(() => {
    if (uploadPercentage === 100 && !error && errorMsg === "") {
      setSubmitButtonState(false);
    }
  }, [uploadPercentage, error, errorMsg]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      title !== "" &&
      body !== "" &&
      filepath !== "" &&
      credits !== "" &&
      parseInt(credits) >= 50
    ) {
      setNewWallet({
        ...newWallet,
        credits: (parseInt(wallet.credits) - parseInt(credits)).toString(),
      });
      setNewWallet((newWallet) => {
        Axios.patch(`/api/wallets/update/${wallet._id}`, newWallet, {
          headers: {
            Authorization: `${props.authToken}`,
          },
        })
          .then((res) => {
            props.history.push("/");
          })
          .catch((err) => {
            props.history.push("/");
          });
        return newWallet;
      });
      await Axios.post("/api/posts/create", posts, {
        headers: {
          Authorization: `${props.authToken}`,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          setError(true);
          props.history.push("/");
          alert("Error Posting Please Try Again Later");
        });
    } else {
      setError(true);
    }
  };
  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();

    data.append("file", files[0]);
    data.append("upload_preset", "adwatcher");

    await Axios.post(
      "https://api.cloudinary.com/v1_1/umarkhawaja/auto/upload",
      data,
      {
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      }
    )
      .then((res) => {
        setPost({ ...posts, filepath: res.data.secure_url });
      })
      .catch((err) => {});
  };
  const backHandler = (e) => {
    e.preventDefault();
    props.history.push("/");
  };
  return (
    <div className="container card-containercp">
      <div className="card shadow mt-5">
        <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n2 mr-n2 mb-n1 text-center">
          <span>Create Post</span>
        </h1>
        <div className="card-body">
          <Form className="create-post-form" onSubmit={submitHandler}>
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
                className="form-control"
                type="text"
                value={title}
                placeholder="Title"
                onChange={(e) => {
                  setPost({ ...posts, title: e.target.value.trim() });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label className="mt-2" for="description">
                Description
              </Label>
              <Input
                className="form-control"
                type="textarea"
                value={body}
                placeholder="Description"
                onChange={(e) => {
                  setPost({ ...posts, body: e.target.value.trim() });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="mt-3">Set Credits</Label>
              <Input
                className="form-control mb-2"
                type="number"
                value={credits}
                placeholder="Enter Credits to be divided"
                onChange={(e) => {
                  setPost({ ...posts, credits: e.target.value });
                  if (e.target.value % 5 !== 0) {
                    setErrorMsg("Credits should be multiples of 5");
                  } else if (
                    parseInt(wallet.credits) >= e.target.value &&
                    e.target.value >= 50
                  ) {
                    setErrorMsg("");
                  } else {
                    setErrorMsg("Not Enough Credits");
                  }
                }}
              />
              {errorMsg !== "" && (
                <span
                  className="font-weight-bold alert-danger mt-3 mb-n5 "
                  style={{ color: "red" }}
                >
                  {errorMsg}
                </span>
              )}
            </FormGroup>
            <FormGroup>
              <Input
                style={{ background: "white" }}
                type="file"
                className="mt-4 mb-3"
                accept="image/* , video/*"
                onChange={uploadImage}
              ></Input>
              {uploadPercentage !== 0 && (
                <Progress percentage={uploadPercentage}></Progress>
              )}
              <Button
                className="mt-4 mb-3 btn btn-info"
                type="submit"
                disabled={submitButtonState}
              >
                CREATE
              </Button>
              <Button
                className="mt-4 mb-3 ml-4 btn-info btn"
                type="back"
                onClick={backHandler}
              >
                Back
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(CreatePost);
