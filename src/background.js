import {
  useEffect, useMemo, useState, useRef,
} from 'react';
import LazyLoad from 'react-lazyload';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils';
import BackgroundInner from './background-inner';


function BackgroundImg(props) {
  const {
    config = {}, onImgLoad, src, children: defualtChildren,
  } = props;

  const [data, setData] = useState({});

  const bgNode = useRef();
  const server = useMemo(() => isServer(), []);

  const { height, cloudimgURL } = data;

  const processBg = (update, windowScreenBecomesBigger) => {
    const bgData = processReactNode(
      props,
      bgNode.current.ref || bgNode.current,
      update,
      windowScreenBecomesBigger,
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

  const containerProps = {
    cloudimgURL,
    className,
    style,
    children,
    config,
    onImgLoad,
    src,
    ...otherProps,
  };

  useEffect(() => {
    if (server || !(bgNode.current || bgNode.current?.ref)) return;

    processBg();

    innerRef.current = bgNode.current || bgNode.current.ref;
  }, []);

  if (server) {
    return (
      <div>{defualtChildren}</div>
    );
  }

  return lazyLoading ? (
    <LazyLoad
      height={height}
      offset={config.lazyLoadOffset}
      ref={bgNode}
      {...lazyLoadConfig}
    >
      <BackgroundInner _ref={bgNode} {...containerProps} />
    </LazyLoad>
  ) : <BackgroundInner _ref={bgNode} {...containerProps} />;
}

export default BackgroundImg;
