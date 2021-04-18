import React from "react";
import firebase from "firebase";
import classes from "./NavBar.module.css";
import { GlobalContext } from "../../context";
import { useToasts } from "react-toast-notifications";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  showUploadSetter(flag: boolean): void;
}

export function Nav(props: IProps) {
  const { addToast } = useToasts();
  const { dispatch, state } = React.useContext(GlobalContext);
  const [authenticating, setAuthenticating] = React.useState(false);
  const [showLoginOptions, setShowLoginOptions] = React.useState(false);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user?.uid && user?.displayName && user?.email && user?.photoURL) {
        dispatch({
          type: "AUTH",
          payload: {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
        });
      } else {
        dispatch({ type: "SIGN_OUT", payload: undefined });
      }
    });
  }, []);

  function auth(kind: "GITHUB" | "GOOGLE") {
    setAuthenticating(true);

    return fireAuth(kind)
      .then((user) => dispatch({ type: "AUTH", payload: user }))
      .catch((err) => addToast(err.message, { appearance: "error" }))
      .finally(() => {
        setAuthenticating(false);
        setShowLoginOptions(false);
      });
  }

  return (
    <nav className={classes.navbar}>
      <strong>DogeGram</strong>

      {!state.auth_user ? (
        <div style={{ position: "relative" }} onClick={() => {}}>
          <button onClick={() => setShowLoginOptions(!showLoginOptions)}>
            sign in
          </button>

          {showLoginOptions && (
            <span className={classes.login_option_menu}>
              <span onClick={() => auth("GOOGLE")}>Google</span>
              <span onClick={() => auth("GITHUB")}>Github</span>
            </span>
          )}
        </div>
      ) : (
        <LoggedInNav
          {...state.auth_user}
          showUploadSetter={props.showUploadSetter}
        />
      )}
    </nav>
  );
}

function LoggedInNav(props: any) {
  const [showUserContextMenu, setShowUserContextMenu] = React.useState(false);

  return (
    <>
      <div
        className={classes.logged_in_nav}
        onClick={() => {
          setShowUserContextMenu(!showUserContextMenu);
        }}
      >
        <div className={classes.logged_in_nav_arrow_wrapper}>
          <FontAwesomeIcon
            icon={showUserContextMenu ? faAngleUp : faAngleDown}
            style={{ fontSize: "1.2em", color: "gray", marginRight: "0.4rem" }}
          />
          <img
            onClick={() => setShowUserContextMenu(!showUserContextMenu)}
            src={props.photoURL}
            alt="user profile"
          />
        </div>

        {showUserContextMenu && (
          <div className={classes.user_context_menu}>
            <span onClick={() => props.showUploadSetter(true)}>
              Upload Image
            </span>
            <span
              onClick={() =>
                firebase
                  .auth()
                  .signOut()
                  .then((value) => {
                    console.log(value);
                  })
              }
            >
              Sign Out
            </span>
          </div>
        )}
      </div>
    </>
  );
}

async function fireAuth(kind: "GOOGLE" | "GITHUB") {
  if (!kind) return;

  const ghAuth = new firebase.auth.GithubAuthProvider();
  const googleAuth = new firebase.auth.GoogleAuthProvider();

  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await firebase
      .auth()
      .signInWithPopup(
        kind === "GITHUB" ? ghAuth : kind === "GOOGLE" ? googleAuth : null
      );
    const user = result.user;
    const doc = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    await addUserToDb("users", doc);

    return doc;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

async function addUserToDb(collection, doc) {
  try {
    const collectionRef = await firebase.firestore().collection(collection);
    await collectionRef
      .doc(firebase.auth().currentUser.uid)
      .set(doc, { merge: true });
    return true;
  } catch (err) {
    throw err;
  }
}
