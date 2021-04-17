import React from "react";
import firebase from "firebase";
import { v4 as uuid4 } from "uuid";
import { IPost } from "../../reducer";
import classes from "./UploadFile.module.css";
import { GlobalContext } from "../../context";
import { useToasts } from "react-toast-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  showUpload: boolean;
  showUploadSetter(flag: boolean): void;
}

export function UploadFile(props: IProps) {
  const { addToast } = useToasts();
  const formRef = React.useRef();
  const { state } = React.useContext(GlobalContext);
  const [formData, setFormData] = React.useState<FormData>();
  const [uploadPercent, setUploadPercent] = React.useState(0);
  const [uploadStarted, setUploadStarted] = React.useState(false);
  const [imgPreviewURIs, setImgPreviewURIs] = React.useState<any>([]);
  const [error, setError] = React.useState<
    firebase.storage.FirebaseStorageError | Error
  >();

  React.useEffect(() => {
    const file = formData?.get("file");

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL((file as File) || undefined);
      reader.onload = (e) => {
        setImgPreviewURIs([e.target.result]);
      };
    }
  }, [formData?.get("file")]);

  // handle error
  React.useEffect(() => {
    error &&
      addToast(error.message, { appearance: "error", autoDismiss: true });
  }, [error]);

  if (!props.showUpload) {
    return <></>;
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div
          className={classes.progress_wrapper}
          style={{ background: uploadStarted ? "pink" : "white" }}
        >
          <div
            className={classes.progress}
            style={{ width: `${uploadPercent}%` }}
          ></div>
        </div>

        <div className={classes.image_preview}>
          {imgPreviewURIs?.map((val) => (
            <img src={val} key={val} />
          ))}
        </div>

        <main>
          <form ref={formRef} id="post-submission-form">
            <input
              type="file"
              name="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                setFormData(new FormData(formRef.current));
              }}
            />
          </form>
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            style={{ fontSize: "4em", color: "gray" }}
          />
        </main>

        <div className={classes.caption}>
          <textarea
            form="post-submission-form"
            name="caption"
            placeholder="any message you want to convey ..."
            onChange={(e) => {
              setFormData(new FormData(formRef.current));
            }}
          />
        </div>

        <div className={classes.action_btn}>
          <button
            disabled={!formData ? true : false}
            className={classes.submit_btn}
            onClick={() => {
              if (formData) {
                const file = formData.get("file") as File;
                const ONE_MB_IN_BYTES = 1024 * 1024;

                if (file.size > ONE_MB_IN_BYTES * 5) {
                  setError(
                    new Error("File size too big. Upload files less than 5MB")
                  );
                  return;
                }

                const storage = firebase.storage().ref();
                const imageRef = storage.child(`images/` + uuid4());
                const uploadTask = imageRef.put(file);

                setUploadStarted(true);

                uploadTask.on("state_changed", (snapshot) => {
                  setUploadPercent(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                });

                uploadTask
                  .then((snapshot) => {
                    return {
                      fileName: snapshot.ref.name,
                      fullPath: snapshot.ref.name,
                      publicURL: `https://firebasestorage.googleapis.com/v0/b/${
                        snapshot.ref.bucket
                      }/o/${encodeURIComponent(
                        snapshot.ref.fullPath
                      )}?alt=media`,
                    };
                  })
                  .then((fileInfo) => {
                    if (fileInfo && state.auth_user) {
                      const doc2save: IPost = {
                        media: [fileInfo.publicURL],
                        author: firebase
                          .firestore()
                          .doc("users/" + firebase.auth().currentUser.uid),
                        caption:
                          formData
                            ?.get("caption")
                            ?.toString()
                            ?.replace("\n", "\\n") || "",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        isPrivate: false,
                      };

                      return firebase
                        .firestore()
                        .collection("posts")
                        .add(doc2save);
                    } else {
                      return Promise.reject(
                        "either the file info is not correct, or there is no logged in user"
                      );
                    }
                  })
                  .then(() => {
                    setError(undefined);
                    setFormData(undefined);
                    props.showUploadSetter(false);
                    setUploadPercent(0);
                    setImgPreviewURIs([]);
                    setUploadStarted(false);
                  })
                  .catch(setError);
              }
            }}
          >
            POST
          </button>

          <button
            className={classes.cancel_btn}
            onClick={() => {
              props.showUploadSetter(false);
              setFormData(undefined);
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
}
