import React from "react";
import firebase from "firebase";
import classes from "./NavBar.module.css";
import { GlobalContext } from "../../context";

interface IProps {
  showUploadSetter(flag: boolean): void;
}

export function Nav(props: IProps) {
  const { dispatch, state } = React.useContext(GlobalContext);
  const [authenticating, setAuthenticating] = React.useState(false);

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

  return (
    <nav className={classes.navbar}>
      <strong>DogeGram</strong>

      {!state.auth_user ? (
        <button
          onClick={() => {
            setAuthenticating(true);
            fireAuth()
              .then((user) => {
                dispatch({ type: "AUTH", payload: user });
              })
              .catch((err) => {
                console.log(err.message);
              })
              .finally(() => {
                setAuthenticating(false);
              });
          }}
        >
          sign in with github
        </button>
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
        <img
          onClick={() => setShowUserContextMenu(!showUserContextMenu)}
          src={props.photoURL}
          alt="user profile"
        />

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

async function fireAuth() {
  const ghAuth = new firebase.auth.GithubAuthProvider();

  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const result = await firebase.auth().signInWithPopup(ghAuth);
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
