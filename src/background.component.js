import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils.js';
import LazyLoad from 'react-lazyload';


class BackgroundImg extends Component {
  constructor(props) {
    super(props);

    this.server = isServer();
    this.state = {
      cloudimgURL: '',
      loaded: false,
      processed: false
    };
  }

  componentDidMount() {
    if (this.server) return;

    this.processBg();
  }

  componentDidUpdate(prevProps) {
    if (this.server) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processBg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processBg();
    }
  }

  processBg = (update, windowScreenBecomesBigger) => {
    const bgNode = findDOMNode(this);
    const data = processReactNode(this.props, bgNode, update, windowScreenBecomesBigger, false);

    if (!data) {
      return;
    }

    if (this.state.cloudimgURL !== data.cloudimgURL) {
      this.preLoadImg(data.cloudimgURL);
    }

    this.setState(data);
  }

  preLoadImg = (cloudimgURL) => {
    const img = new Image();

    img.onload = this.onImgLoad;
    img.src = cloudimgURL;
  }

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    if (this.server) return null;
    
    const { loaded, height, processed, cloudimgURL } = this.state;
    const {
      alt, className, config, style, lazyLoadConfig, lazyLoading = config.lazyLoading, children, ...otherProps
    } = getFilteredBgProps(this.props);

    if (!processed) return <div>{children}</div>;

    const Container = (
      <div
        {...otherProps}
        className={[className, 'cloudimage-image-background', loaded ? 'loaded' : 'loading'].join(' ').trim()}
        style={{ ...style, backgroundImage: `url(${cloudimgURL})` }}
      >
        {children}
      </div>
    );

    return lazyLoading ? (
      <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {Container}
      </LazyLoad>
    ) : Container;
  }
}

export default BackgroundImg;