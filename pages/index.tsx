import React from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/Card";
import { Nav } from "../components/NavBar";
import { UploadFile } from "../components/UploadFile";
import { useGetPosts } from "../hooks/useGetPosts";

export default function Home() {
  const [showUpload, setShowUpload] = React.useState(false);
  const { error, data } = useGetPosts("posts");

  console.log({ data });

  return (
    <>
      <UploadFile showUpload={showUpload} showUploadSetter={setShowUpload} />
      <Nav showUploadSetter={setShowUpload} />
      <Layout>
        {data?.map((doc) => (
          <Card
            imgSrc={doc.media[0]}
            key={doc.id}
            author={doc.author}
            caption={doc.caption}
            dateOfPosting={doc.createdAt}
          />
        ))}
      </Layout>
    </>
  );
}
