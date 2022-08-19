import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import LazyLoad from 'react-lazyload';

import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils';
import usePrevious from './Hooks/usePrevious';


function Img(props) {
  const { config, src } = props;

  const {
    lazyLoading: _lazyLoading, lazyLoadOffset, innerWidth, delay,
  } = config;

  const { lazyLoading = _lazyLoading } = props;

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});

  const imgNode = useRef();
  const server = useMemo(() => isServer(), []);
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  const {
    cloudimgURL,
    cloudimgSRCSET,
    height,
  } = data;

  const {
    alt,
    className,
    lazyLoadConfig,
    preserveSize,
    imgNodeWidth,
    imgNodeHeight,
    innerRef,
    ...otherProps
  } = getFilteredProps(props);

  const { onImgLoad } = otherProps;

  const getCloudimgSRCSET = () => cloudimgSRCSET
    ?.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ');

  const processImg = (update, windowScreenBecomesBigger) => {
    const imgData = processReactNode(
      props,
      imgNode.current.ref || imgNode.current,
      update,
      windowScreenBecomesBigger,
    );

    if (imgData) {
      setData(imgData);
    }
  };

  const _onImgLoad = (event) => {
    setLoaded(true);

    if (typeof onImgLoad === 'function') {
      onImgLoad(event);
    }
  };

  useEffect(() => {
    if (server || !(imgNode.current || imgNode.current?.ref)) return;

    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        processImg();
      }, delay);
    } else {
      processImg();
    }

    innerRef.current = imgNode.current || imgNode.current.ref;
  }, []);

  useEffect(() => {
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processImg(
        true,
        innerWidth > previousProps.innerWidth,
      );
    }

    if (src !== previousProps.src) {
      processImg();
    }
  }, [innerWidth, src]);

  const pictureClassName = `${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim();

  const picture = (
    <img
      className={pictureClassName}
      src={cloudimgURL}
      {...(cloudimgSRCSET && !server && {
        srcSet: getCloudimgSRCSET(),
      })}
      alt={alt}
      ref={imgNode}
      onLoad={_onImgLoad}
      {...otherProps}
    />
  );

  return lazyLoading && !server ? (
    <LazyLoad
      height={height}
      ref={imgNode}
      offset={lazyLoadOffset}
      {...lazyLoadConfig}
    >
      {picture}
    </LazyLoad>
  ) : picture;
}

export default Img;
