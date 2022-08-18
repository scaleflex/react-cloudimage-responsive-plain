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
      bgNode.current,
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
    if (server || !bgNode.current) return;

    processBg();

    innerRef.current = bgNode.current;
  }, []);

  if (server) {
    return (
      <div>{defualtChildren}</div>
    );
  }

  return false ? (
    <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
      <BackgroundInner _ref={bgNode} {...containerProps} />
    </LazyLoad>
  ) : <BackgroundInner _ref={bgNode} {...containerProps} />;
}

export default BackgroundImg;
