import React from "react";
import firebase from "firebase";
import { GetServerSideProps } from "next";
import { Layout } from "../components/Layout";
import { Card } from "../components/Card";
import { Nav } from "../components/NavBar";
import { UploadFile } from "../components/UploadFile";
import { useGetPosts } from "../hooks/useGetPosts";

export default function Home({ posts }) {
  const [showUpload, setShowUpload] = React.useState(false);
  const [postsData, setPostsData] = React.useState<any[]>(posts);

  const { error, data } = useGetPosts("posts");
  React.useEffect(() => data && setPostsData(data), [data]);

  return (
    <>
      <UploadFile showUpload={showUpload} showUploadSetter={setShowUpload} />
      <Nav showUploadSetter={setShowUpload} />
      <Layout>
        {postsData?.map((doc) => (
          <Card
            key={doc.uid}
            imgSrc={doc.media[0]}
            author={doc.author}
            caption={doc.caption}
            dateOfPosting={doc.createdAt}
            postUID={doc.uid}
            likedBy={doc.likedBy}
          />
        ))}
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const dataArr = [];
  const collectionRef = firebase.firestore().collection("posts");
  const snapshot = await collectionRef
    .where("isPrivate", "==", false)
    .orderBy("createdAt", "desc")
    .get();

  for (let i = 0; i < snapshot.docs.length; i++) {
    const doc = snapshot.docs[i];
    const postInfo = doc.data();
    const author = await postInfo?.author?.get();

    postInfo.uid = doc.id;
    postInfo.author = author.data();
    postInfo.createdAt = postInfo.createdAt.toDate().getTime();

    dataArr.push(postInfo);
  }

  return { props: { posts: dataArr } };
};
