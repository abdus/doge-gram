import React from "react";
import classes from "./Image.module.css";

interface IProps {
  src: string;
  caption?: string;
  alt?: string;
}

export function Image(props: IProps) {
  return (
    <>
      <figure className={classes.figure}>
        <div>
          <img src={props.src} alt={props.alt} />
        </div>
      </figure>
    </>
  );
}
