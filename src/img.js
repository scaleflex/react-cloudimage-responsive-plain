import React, { useEffect, useMemo, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import { BASE_64_PLACEHOLDER } from 'cloudimage-responsive-utils/dist/constants';
import usePrevious from './Hooks/usePrevious';


function Img(props) {
  const { config, src } = props;
  const { lazyLoading: configLazyLoadingValue, lazyLoadOffset, innerWidth, delay } = config;
  const { lazyLoading = configLazyLoadingValue } = props;

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});

  const imgNode = useRef();

  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  const server = useMemo(() => isServer(), []);

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
    ...otherProps
  } = getFilteredProps(props);

  const getCloudimgSRCSET = () => cloudimgSRCSET
    ?.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ');

  const picClassName = `${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim();

  const processImg = (update, windowScreenBecomesBigger) => {
    const imgData = processReactNode(
      props,
      imgNode.current,
      update,
      windowScreenBecomesBigger);

    if (imgData) setData(imgData);
  }

  const onImgLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    if(server) return;

    if (imgNode.current) processImg();
  }, []);

  useEffect(() => {
    if(!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
        processImg(
          true,
          innerWidth > previousProps.innerWidth,
        );
    }

    if (src !== previousProps.src) {
        processImg(true, false);
    }

  }, [innerWidth, src]);

  const picture = (
    <img
      className={picClassName}
      src={cloudimgURL}
      {...(cloudimgSRCSET && !server && {
        srcSet: getCloudimgSRCSET(),
      })}
      alt={alt}
      ref={imgNode}
      onLoad={onImgLoad}
      {...otherProps}
    />
  );

  if (server)
   return <img alt={alt} src={BASE_64_PLACEHOLDER}/>;
  
    return false ? (
    <LazyLoad 
      height={height}
      offset={lazyLoadOffset}
      {...lazyLoadConfig}
    >
      {picture}
    </LazyLoad>
  ) : picture;
};

export default Img;
