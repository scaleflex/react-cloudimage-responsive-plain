import React, { useEffect, useState } from "react";

function BackgroundInner(props) {
  const {
    cloudimgURL,
    className,
    style,
    children,
    innerRef,
    config,
    ...otherProps
  } = props;

  const [loaded, setLoaded] = useState(false);

  const { delay } = config;

  const onImgLoad = () => {
    setLoaded(true);
  }

  const preLoadImg = (cloudimgURL) => {
    const img = new Image();

    img.onload = onImgLoad;
    img.src = cloudimgURL;
  };

  const containerClassName = [
    className,
    'cloudimage-background',
    loaded ? 'loaded' : 'loading',
  ].join(' ').trim()

  useEffect(() => {
    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        preLoadImg(cloudimgURL);
      }, delay);
    } else {
      preLoadImg(cloudimgURL);
    }
  }, []);

  return (
    <div
      {...otherProps}
      ref={innerRef}
      className={containerClassName}
      style={{ ...style, backgroundImage: `url(${cloudimgURL})` }}
    >
      {children}
    </div>
  );
}

export default BackgroundInner;