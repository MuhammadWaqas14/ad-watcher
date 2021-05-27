import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";

import { Modal, ModalHeader, ModalBody, Card, CardImg } from "reactstrap";
import "../../../node_modules/video-react/dist/video-react.css";
import { Player, Shortcut, ControlBar, BigPlayButton } from "video-react";
function ContentReports(props) {
  const [user, setUser] = useState();
  const [reports, setReports] = useState();
  const [current, setCurrent] = useState();
  const [currentReport, setCurrentReport] = useState();

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

  const fetchReports = useCallback(async () => {
    await Axios.get("/api/reports/", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);
  const fetchPost = async (postID) => {
    await Axios.get(`/api/posts/post/${postID}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setCurrent(res.data[0]);
        setCurrent((current) => {
          return current;
        });
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/");
      });
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    fetchReports();
    if (user && user.user_name !== "administrator") {
      alert("Unautrhorized, redirecting");
      props.history.push("/");
    }
  }, [fetchUser, user, props, fetchReports]);

  const [modal, setModal] = useState(false);
  const changeButtonState = () => {
    setModalButtonState(!modalButtonState);
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

  const deletePost = async (post) => {
    await Axios.delete(`/api/posts/delete/${post._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log(res);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteReport = async (report) => {
    await Axios.delete(`/api/reports/delete/${report._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <h1 className="display-4 text-center">Content Reports </h1>
      <Card className="card col-12 text-center mt-3 mb-3">
        <label className="card-header">Content Reports</label>
        <div className="card-body ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {reports &&
                reports.map((report) => (
                  <li key={report._id} className="alert-danger pb-3 mt-3 mb-3">
                    <label className="card-body w-75 h-auto">
                      Reported by {report.user_id} for the reason:{" "}
                      {report.reason}.
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button
                        className="btn btn-info m-2"
                        onClick={() => {
                          setCurrentReport(report);
                          fetchPost(report.post);
                          toggle();
                        }}
                      >
                        View Post
                      </button>
                    </div>

                    <div>
                      {modal && current && (
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
                          <ModalHeader>
                            {current.title}: {current.body}
                          </ModalHeader>
                          <div className="p-2 mt-2 float-right">
                            <button
                              className="btn btn-success m-2"
                              onClick={() => {
                                deletePost(current);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger m-2"
                              onClick={() => {
                                deleteReport(currentReport);
                              }}
                            >
                              Deny
                            </button>
                          </div>
                          <ModalBody>
                            {current.filepath.indexOf("video") >= 0 ? (
                              <>
                                <Player
                                  contextMenu="none"
                                  id="postContent"
                                  playsInLine
                                  src={current.filepath}
                                  onContextMenu={(e) => e.preventDefault()}
                                >
                                  <BigPlayButton />
                                  <ControlBar />
                                  <Shortcut />
                                </Player>
                              </>
                            ) : (
                              <CardImg
                                className="image-fluid"
                                style={{
                                  maxHeight: "800px",
                                }}
                                width="auto"
                                height="auto"
                                src={current.filepath}
                                alt="productimagehere"
                              />
                            )}
                          </ModalBody>
                        </Modal>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(ContentReports);
