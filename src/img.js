import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import LazyLoad from 'react-lazy-load';

import { generateAlt, isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils';
import usePrevious from './Hooks/usePrevious';


function Img(props) {
  const { config, src } = props;
  const {
    lazyLoading: _lazyLoading,
    lazyLoadOffset, innerWidth, delay,
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
    ...otherProps
  } = getFilteredProps(props);

  const {
    innerRef,
    onImgLoad,
    disableAnimation,
    doNotReplaceURL,
    config: _config,
    ...filteredProps
  } = otherProps;

  const getCloudimgSRCSET = () => cloudimgSRCSET
    ?.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ');

  const processImg = (update, windowScreenBecomesBigger) => {
    if (!imgNode?.current) return;

    const imgData = processReactNode(
      props,
      { parentNode: {},...imgNode.current },
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
    if (server || !imgNode.current) return;

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
  const pictureAlt = alt || generateAlt(src);

  const picture = (
    <img
      {...filteredProps}
      className={pictureClassName}
      src={cloudimgURL}
      {...(cloudimgSRCSET && {
        srcSet: getCloudimgSRCSET(),
      })}
      alt={pictureAlt}
      ref={imgNode}
      onLoad={_onImgLoad}
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
