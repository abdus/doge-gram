import React from "react";
import classes from "./Image.module.css";
//@ts-ignore
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

  // without this effect call, component does not seem to be rerendered.
  // I don't know why
  React.useEffect(() => {}, [imageLoaded])

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
              console.log(`onload fired`)
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
