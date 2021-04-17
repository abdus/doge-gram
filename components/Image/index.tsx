import React from "react";
import classes from "./Image.module.css";
import placeholder from "../../assets/placeholder-image.png";

interface IProps {
  src: string;
  caption?: string;
  alt?: string;
}

export function Image(props: IProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [height, setHeight] = React.useState<string | number>("30rem");
  const [minHeight, setMinHeight] = React.useState<string | number>("30rem");

  return (
    <>
      <figure className={classes.figure}>
        <div
          style={{
            maxHeight: typeof height === "number" ? `${height}px` : height,
            minHeight:
              typeof minHeight === "number" ? `${minHeight}px` : minHeight,
          }}
          onLoad={(e) => {
            const clientRect = (e.target as HTMLElement).getBoundingClientRect();
            setHeight(clientRect.width); // to make a square, width === height
            setMinHeight(0);
          }}
        >
          <img
            src={props.src}
            alt={props.alt}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "0.4s ease-out opacity",
            }}
            onLoad={() => {
              setImageLoaded(true);
            }}
          />

          {!imageLoaded && <PlaceholderImage />}
        </div>
      </figure>
    </>
  );
}

function PlaceholderImage() {
  return <img src={placeholder} />;
}
