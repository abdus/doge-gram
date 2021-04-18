/*
 * this card component will represent each of the posts. it is consists of three
 * sections, namely:
 *         1. header (contains OP's information like avatar, name etc)
 *         2. body (contains the image)
 *         3. footer (contains desc, likes and comments)
 *
 */

import React from "react";
import firebase from "firebase";
import { Image } from "../Image";
import { IUser } from "../../reducer";
import classes from "./Card.module.css";
import { useToasts } from "react-toast-notifications";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const FA_FONT_SIZE = "1.4em";
const FA_FONT_COLOR = "#4b4b4b";

interface IProps {
  postUID: string;
  imgSrc: string;
  imgAltText?: string;
  caption?: string;
  author: IUser;
  dateOfPosting: string; // firestore.FieldValue.serverTimestamp
  likedBy: string[];
}

export function Card(props: IProps) {
  const { addToast } = useToasts();
  const [post, setPost] = React.useState<IProps>(props);
  const [comment, setComment] = React.useState<string>("");
  const [allComments, setAllComments] = React.useState<any>();
  const [hasLiked, setHasLiked] = React.useState(
    post?.likedBy?.includes(firebase.auth()?.currentUser?.uid)
  );
  const docRef = React.useRef(
    firebase.firestore().doc(`posts/${props.postUID}`)
  ).current;

  // listen for update
  React.useEffect(() => {
    const unsub = docRef.onSnapshot((snapshot) => {
      const newDoc = snapshot.data();
      newDoc?.author?.get().then((author) => {
        setPost({
          ...(post || ({} as any)),
          imgSrc: newDoc?.media[0],
          caption: newDoc?.caption,
          author: author?.data(),
          likedBy: newDoc?.likedBy,
        });
      });
    });

    return () => unsub();
  }, [props.postUID]);

  // listen for comment updates
  React.useEffect(() => {
    const commentsRef = firebase
      .firestore()
      .collection("comments")
      .where("postId", "==", post.postUID)
      .orderBy("createdAt", "desc");

    const unsub = commentsRef.onSnapshot(async (snapshot) => {
      const cmntsArr = [];

      for (let i = 0; i < snapshot.docs.length; i++) {
        const doc = snapshot.docs[i].data();
        const author = await doc?.author?.get();

        doc.author = author.data();
        doc.id = snapshot.docs[i].id;
        doc.createdAt = doc?.createdAt?.toDate()?.getTime();

        cmntsArr.push(doc);
      }

      setAllComments(cmntsArr);
    });

    return () => unsub();
  }, [post.postUID]);

  return (
    <article className={classes.wrapper}>
      <aside
        className={classes.header}
        onClick={() => (window.location.href = `/user/${post?.author?.uid}`)}
      >
        <img src={post?.author?.photoURL} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{post?.author?.name}</span>
          <small style={{ color: "gray", marginTop: "0.2rem" }}>
            {formatDate(new Date(post?.dateOfPosting))}
          </small>
        </div>
      </aside>
      <main className={classes.main_section}>
        <Image src={post?.imgSrc} alt={post?.imgAltText} />
      </main>
      <aside className={classes.footer}>
        <div
          className={classes.flex_nowrap_aligncenter}
          style={{ margin: "0.4rem 0 0.8rem 0" }}
        >
          <span
            style={{ marginRight: "2rem", cursor: "pointer" }}
            className={classes.flex_nowrap_aligncenter}
            onClick={() => {
              if (firebase.auth().currentUser?.uid) {
                const loggedinUserUID = firebase.auth().currentUser?.uid;
                let tmp = JSON.parse(JSON.stringify(post?.likedBy || []));
                const isAlreadyLiked = tmp?.includes(loggedinUserUID);
                console.log(post.likedBy, isAlreadyLiked);

                // liked, reflect the data on server
                if (!isAlreadyLiked) {
                  tmp.push(loggedinUserUID);
                  tmp = new Set(tmp);
                  docRef.set({ likedBy: [...tmp] }, { merge: true });
                  setHasLiked(true);
                } else {
                  // unliked, reflect the data on server
                  const index = tmp.indexOf(loggedinUserUID);
                  tmp.splice(index, 1);
                  docRef.set({ likedBy: tmp }, { merge: true });
                  setHasLiked(false);
                }
              } else {
                addToast("You must be logged in to like a post", {
                  appearance: "error",
                  autoDismiss: true,
                });
              }
            }}
          >
            <FontAwesomeIcon
              icon={hasLiked ? faHeartSolid : faHeart}
              style={{
                fontSize: FA_FONT_SIZE,
                marginRight: "0.5rem",
                color: hasLiked ? "red" : FA_FONT_COLOR,
              }}
            />
            {props?.likedBy?.length || 0}
          </span>

          <span
            style={{ marginRight: "2rem" }}
            className={classes.flex_nowrap_aligncenter}
          >
            <FontAwesomeIcon
              icon={faComment}
              style={{
                fontSize: FA_FONT_SIZE,
                color: FA_FONT_COLOR,
                marginRight: "0.5rem",
              }}
            />
            0
          </span>
        </div>

        {/*description*/}
        {post?.caption && typeof post?.caption === "string" && (
          <div className={classes.caption}>
            {post?.caption?.split("\\n").map((val, i) => (
              <React.Fragment key={i}>
                {val}
                <br />
              </React.Fragment>
            ))}
          </div>
        )}

        {/*comment section*/}
        <div className={classes.comments_wrapper}>
          <div className={classes.render_comment}>
            {allComments?.map((comm) => {
              return (
                <>
                  <img src={comm?.author?.photoURL} />
                  <article>
                    <div>
                      <strong>{comm?.author?.name}</strong> {comm?.body}
                    </div>
                    <small>{formatDate(new Date(comm?.createdAt))}</small>
                  </article>
                </>
              );
            })}
          </div>

          <div className={classes.comment_box}>
            <input
              style={{ width: "100%", marginRight: "0.5rem" }}
              placeholder="add a comment ..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            {comment && (
              <button
                onClick={async () => {
                  if (!firebase.auth().currentUser) {
                    return addToast("You must be logged in to post a comment", {
                      autoDismiss: true,
                      appearance: "error",
                    });
                  }

                  try {
                    const collectionRef = firebase
                      .firestore()
                      .collection("comments");

                    await collectionRef.add({
                      body: comment,
                      postId: post.postUID,
                      author: await firebase
                        .firestore()
                        .doc(`users/${firebase.auth()?.currentUser?.uid}`),
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                    setComment("");
                  } catch (err) {
                    return addToast("You must be logged in to post a comment", {
                      autoDismiss: true,
                      appearance: "error",
                    });
                  }
                }}
              >
                send
              </button>
            )}
          </div>
        </div>
      </aside>
    </article>
  );
}

function formatDate(dt: Date) {
  if (!(dt instanceof Date)) return "";

  const now = new Date();
  const isPostedToday =
    `${now.getDate()}${now.getMonth()}${now.getFullYear()}` ===
    `${dt.getDate()}${dt.getMonth()}${dt.getFullYear()}`;

  if (isPostedToday) {
    // calculate the hours
    const seconds = Math.floor((now.getTime() - dt.getTime()) / 1000);
    const ONE_SEC = 1;
    const ONE_MIN_IN_SEC = ONE_SEC * 60;
    const ONE_HOUR_IN_SEC = ONE_MIN_IN_SEC * 60;
    const ONE_DAY_IN_SEC = ONE_HOUR_IN_SEC * 24;
    const ONE_WEEK_IN_SEC = ONE_DAY_IN_SEC * 7;

    // for more than one week, return the date
    if (seconds / ONE_WEEK_IN_SEC > 1) {
      return "more than a week ago";
    }

    // 6 days ago
    if (seconds / (ONE_DAY_IN_SEC * 6) > 1) {
      return "6 days ago";
    }

    // 5 days ago
    if (seconds / (ONE_DAY_IN_SEC * 5) > 1) {
      return "5 days ago";
    }

    // 4 days ago
    if (seconds / (ONE_DAY_IN_SEC * 4) > 1) {
      return "4 days ago";
    }

    // 3 days ago
    if (seconds / (ONE_DAY_IN_SEC * 3) > 1) {
      return "3 days ago";
    }

    // 2 days ago
    if (seconds / (ONE_DAY_IN_SEC * 2) > 1) {
      return "2 days ago";
    }

    // 1 days ago
    if (seconds / ONE_DAY_IN_SEC > 1) {
      return "1 day ago";
    }

    // 12 hour ago
    if (seconds / (ONE_HOUR_IN_SEC * 12) > 1) {
      return "12 hours ago";
    }

    // 6 hour ago
    if (seconds / (ONE_HOUR_IN_SEC * 6) > 1) {
      return "6 hours ago";
    }

    // 3 hour ago
    if (seconds / (ONE_HOUR_IN_SEC * 3) > 1) {
      return "3 hours ago";
    }

    // 2 hour ago
    if (seconds / (ONE_HOUR_IN_SEC * 2) > 1) {
      return "1 hours ago";
    }

    // 1 hour ago
    if (seconds / ONE_HOUR_IN_SEC > 1) {
      return "1 hours ago";
    }

    // 30 min ago
    if (seconds / (ONE_MIN_IN_SEC * 30) > 1) {
      return "30 minutes ago";
    }

    // 15 min ago
    if (seconds / (ONE_MIN_IN_SEC * 15) > 1) {
      return "15 minutes ago";
    }

    // 7 min ago
    if (seconds / (ONE_MIN_IN_SEC * 7) > 1) {
      return "7 minutes ago";
    }

    // 30 min ago
    if (seconds / ONE_MIN_IN_SEC > 1) {
      return "1 minute ago";
    }

    return "a few seconds ago";
  }

  return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
}
