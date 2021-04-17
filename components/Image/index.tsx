import React from "react";
import classes from "./Image.module.css";

interface IProps {
  src: string;
  caption?: string;
  alt?: string;
}

export function Image(props: IProps) {
  const [height, setHeight] = React.useState<string | number>("30rem");

  return (
    <>
      <figure className={classes.figure}>
        <div
          style={{
            maxHeight: typeof height === "number" ? `${height}px` : height,
          }}
          onLoad={(e) => {
            const clientRect = (e.target as HTMLElement).getBoundingClientRect();
            setHeight(clientRect.width); // to make a square, width === height
          }}
        >
          <img src={props.src} alt={props.alt} />
        </div>
      </figure>
    </>
  );
}
