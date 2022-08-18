import { useEffect, useState } from 'react';


function BackgroundInner(props) {
  const {
    cloudimgURL,
    className,
    style,
    children,
    _ref,
    config,
    onImgLoad,
    ...otherProps
  } = props;

  const [loaded, setLoaded] = useState(false);

  const { delay } = config;

  const _onImgLoad = (event) => {
    setLoaded(true);

    if (typeof onImgLoad === 'function') {
      onImgLoad(event);
    }
  };

  const preLoadImg = () => {
    const img = new Image();

    img.onload = _onImgLoad;
    img.src = cloudimgURL;
  };

  const containerClassName = [
    className,
    'cloudimage-background',
    loaded ? 'loaded' : 'loading',
  ].join(' ').trim();

  useEffect(() => {
    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        preLoadImg();
      }, delay);
    } else {
      preLoadImg();
    }
  }, []);

  return (
    <div
      {...otherProps}
      ref={_ref}
      className={containerClassName}
      style={{ ...style, backgroundImage: `url(${cloudimgURL})` }}
    >
      {children}
    </div>
  );
}

export default BackgroundInner;
