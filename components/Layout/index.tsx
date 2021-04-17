import React from "react";
import "@fontsource/rubik"

interface IProps {
  children: React.ReactNode | React.ReactNodeArray;
}

export function Layout(props: IProps) {
  return (
    <>
      <main>{props.children}</main>
      <style jsx>{`
          main {
            max-width: 40rem;
            margin: auto;
          }
      `}</style>
    </>
  );
}
