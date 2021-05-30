import "../../../node_modules/video-react/dist/video-react.css";
import {
  Player,
  Shortcut,
  ControlBar,
  BigPlayButton,
  VolumeMenuButton,
} from "video-react";
import Axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { DropdownMenu, DropdownItem } from "reactstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
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
  const [modal, setModal] = useState(false);

  const changeButtonState = () => {
    setTimeout(() => {
      setWallet({
        ...wallet,
        credits: (parseInt(wallet.credits) + 5).toString(),
      });
      setWallet((wallet) => {
        Axios.patch(`/api/wallets/update/${wallet._id}`, wallet, {
          headers: {
            Authorization: `${props.authToken}`,
          },
        })
          .then((res) => {})
          .catch((err) => {});
        return wallet;
      });
      setModalButtonState(!modalButtonState);
    }, 30000);
  };

  const toggle = () => {
    setModal(!modal);
    !modalButtonState ? setModalButtonState(true) : changeButtonState();
  };

  const [modalButtonState, setModalButtonState] = useState(true);

  const externalCloseBtn = (
    <button
      className="close"
      style={{ position: "absolute", top: "15px", right: "15px" }}
      disabled={modalButtonState}
      onClick={() => {
        toggle();
      }}
    >
      &times;
    </button>
  );
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState({});
  const [user, setUser] = useState([]);
  const [wallet, setWallet] = useState();

  const fetchUser = useCallback(async () => {
    await Axios.get("/api/posts/user", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);
  const fetchData = useCallback(async () => {
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
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);
  const fetchWallet = useCallback(async () => {
    await Axios.get("/api/wallets", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  useEffect(() => {
    fetchData();
    fetchUser();
    fetchWallet();
  }, [fetchData, fetchUser, fetchWallet, posts]);

  const deletePost = async (post) => {
    await Axios.delete(`/api/posts/delete/${post._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {});
  };

  // const walletSubmit = () => {
  //   props.history.push("/wallet");
  // };

  return (
    <div className="posts-home card-container">
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
                {modal && (
                  <Modal
                    contextMenu="none"
                    onContextMenu={(e) => e.preventDefault()}
                    isOpen={modal}
                    toggle={toggle}
                    centered="true"
                    size="lg"
                    backdrop="static"
                    keyboard={false}
                    external={externalCloseBtn}
                  >
                    <ModalHeader>{current.title}</ModalHeader>
                    <ModalBody>
                      {current.filepath.indexOf("video") >= 0 ? (
                        <>
                          <Player
                            contextMenu="none"
                            id="postContent1"
                            muted={true}
                            autoPlay
                            src={current.filepath}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <BigPlayButton position="center" disabled={true} />
                            <ControlBar
                              disableDefaultControls={true}
                              //disableCompletely={true}
                            >
                              <VolumeMenuButton />
                            </ControlBar>
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
                          src={current.filepath}
                          alt="productimagehere"
                        />
                      )}
                    </ModalBody>
                  </Modal>
                )}

                <Card
                  contextMenu="none"
                  onContextMenu={(e) => e.preventDefault()}
                  className="card shadow m-4 bg-light"
                >
                  <CardBody className="card-body">
                    <CardTitle
                      className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n4 ml-n4 mr-n4 mb-n1"
                      tag="h3"
                    >
                      {post.author}
                      <div className="float-right">
                        <button
                          className="dropdown-toggle btn btn-info btn-sm mr-n1"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        ></button>
                        <DropdownMenu className="dropdown-menu">
                          {post.author === user.user_name ? (
                            <>
                              <DropdownItem
                                className="btn btn-secondary dropdown-item"
                                onClick={() => {
                                  deletePost(post);
                                }}
                              >
                                Delete
                              </DropdownItem>
                              <DropdownItem
                                className="btn btn-secondary dropdown-item"
                                onClick={() =>
                                  props.history.push(`/update-post/${post._id}`)
                                }
                              >
                                Update
                              </DropdownItem>
                            </>
                          ) : (
                            <DropdownItem
                              className="btn btn-secondary dropdown-item"
                              onClick={() =>
                                props.history.push(`/report-post/${post._id}`)
                              }
                            >
                              Report
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </div>
                    </CardTitle>

                    <CardSubtitle tag="h6" className="mt-3">
                      CREDITS: {post.credits}
                    </CardSubtitle>

                    <CardText className="card-text mt-1 mb-n3">
                      {post.body}
                    </CardText>
                  </CardBody>
                  {post.filepath.indexOf("video") >= 0 ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrent(post);
                        toggle();
                      }}
                    >
                      <Player
                        contextMenu="none"
                        id="postContent"
                        src={post.filepath}
                        muted={true}
                        clickable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <BigPlayButton position="center" disabled />
                        <ControlBar
                          disableDefaultControls={true}
                          disableCompletely={true}
                        />
                        <Shortcut clickable={false} dblclickable={false} />
                      </Player>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrent(post);
                        toggle();
                      }}
                    >
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
                    </div>
                  )}
                </Card>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="container">
          <Card
            contextMenu="none"
            onContextMenu={(e) => e.preventDefault()}
            className="card m-4 bg-light"
          >
            <CardBody className="card-body">
              <CardTitle
                className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n4 ml-n4 mr-n4 mb-n1"
                tag="h3"
              >
                NO POSTS TO DISPLAY RIGHT NOW
              </CardTitle>
              <CardSubtitle tag="h6" className="mt-3">
                Create a post of your own by clicking Create Post
              </CardSubtitle>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default withRouter(Welcome);
