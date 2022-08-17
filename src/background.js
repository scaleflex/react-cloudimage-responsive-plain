import React, { useEffect, useMemo, useState, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils.js';
import BackgroundInner from './background-inner.js';


function BackgroundImg(props) {
  const { config = {}, children: defualtChildren } = props;

  const [data, setData] = useState({});

  const bgNode = useRef();

  const server = useMemo(() => isServer, []);

  const { height, cloudimgURL } = data;

  const processBg = (update, windowScreenBecomesBigger) => {
    const bgData = processReactNode(
      props,
      bgNode.current,
      update,
      windowScreenBecomesBigger
    );

    if (bgData) {
      setData(bgData);
    }
  };

  const {
    className,
    style,
    lazyLoadConfig,
    lazyLoading = config.lazyLoading,
    children,
    innerRef,
    doNotReplaceURL,
    ...otherProps
  } = getFilteredBgProps(props);

  useEffect(() => {
    if (server || !bgNode.current) return;

    processBg();
  }, []);

  if (server) {
    return (
      <div>{defualtChildren}</div>
    );
  }

  const Container = <BackgroundInner innerRef={innerRef} {...{ cloudimgURL, className, style, children, otherProps, config }} />;

  return false ? (
    <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
      {Container}
    </LazyLoad>
  ) : Container;

}

export default BackgroundImg;
