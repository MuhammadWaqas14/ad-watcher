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
            console.log(res);
            props.history.push("/");
          })
          .catch((err) => {
            props.history.push("/");
            console.log(err);
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
          console.log(err);
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
      .catch((err) => console.log(err));
  };
  const backHandler = (e) => {
    e.preventDefault();
    props.history.push("/");
  };
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
              <br></br>
              {errorMsg !== "" && (
                <span
                  className="font-weight-bold mt-6 mb-6"
                  style={{ color: "red" }}
                >
                  {errorMsg}
                </span>
              )}
              <Input
                type="number"
                value={credits}
                placeholder="Enter Credits to be divided"
                onChange={(e) => {
                  setPost({ ...posts, credits: e.target.value });

                  if (
                    parseInt(wallet.credits) >= e.target.value &&
                    e.target.value >= 50
                  ) {
                    setErrorMsg("");
                  } else {
                    setErrorMsg("Not Enough Credits");
                  }
                }}
              />
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
                className="mt-4 mb-3"
                type="submit"
                disabled={submitButtonState}
              >
                CREATE
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

export default withRouter(CreatePost);
