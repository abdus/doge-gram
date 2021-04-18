import React from "react";
import firebase from "firebase";

export function useGetPosts(collection: string) {
  const [data, setData] = React.useState<any>([]);
  const [error, setError] = React.useState<firebase.firestore.FirestoreError>();

  const collectionRef = firebase.firestore().collection(collection);

  React.useEffect(() => {
    let unsub;

    try {
      unsub = collectionRef
        .where("isPrivate", "==", false)
        .orderBy("createdAt", "desc")
        .onSnapshot(async (query) => {
          const dataArr = [];
          const len = query.docs.length;

          for (let i = 0; i < len; i++) {
            const doc = query.docs[i];
            const author = await doc.data()?.author?.get();
            const postData = doc.data();

            postData.uid = doc.id;
            postData.author = author.data();
            postData.createdAt = postData?.createdAt?.toDate()?.getTime(); //serializable datatype

            dataArr.push(postData);
          }

          setData(dataArr);
        });
    } catch (err) {
      console.log(err.message);
      setError(err);
    }

    return () => unsub();
  }, [collection]);

  return { error, data };
}
