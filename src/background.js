import {
  useEffect, useMemo, useState, useRef,
} from 'react';
import LazyLoad from 'react-lazyload';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils';
import BackgroundInner from './background-inner';
import usePrevious from './Hooks/usePrevious';


function BackgroundImg(props) {
  const {
    config = {}, onImgLoad, src, children: defualtChildren,
  } = props;

  const { innerWidth } = config;

  const [data, setData] = useState({});

  const bgNode = useRef();
  const server = useMemo(() => isServer(), []);
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

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

  useEffect(() => {
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processBg(
        true,
        innerWidth > previousProps.innerWidth,
      );
    }

    if (src !== previousProps.src) {
      processBg();
    }
  }, [innerWidth, src]);

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
