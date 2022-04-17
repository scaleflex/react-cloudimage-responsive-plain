import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import LazyLoad from 'react-lazyload';
import { BASE_64_PLACEHOLDER } from 'cloudimage-responsive-utils/dist/constants';


class Img extends Component {
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

    this.processImg();
  }

  componentDidUpdate(prevProps) {
    if (this.server) return;

    const { config: { innerWidth }, src } = this.props;

    if (prevProps.config.innerWidth !== innerWidth) {
      this.processImg(true, innerWidth > prevProps.config.innerWidth);
    }

    if (src !== prevProps.src) {
      this.processImg();
    }
  }

  processImg = (update, windowScreenBecomesBigger) => {
    const imgNode = findDOMNode(this);
    const data = processReactNode(this.props, imgNode, update, windowScreenBecomesBigger, false);

    this.setState(data);
  }

  onImgLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { config = {} } = this.props;
    const { lazyLoading: configLazyLoadingValue } = config;
    const { lazyLoading = configLazyLoadingValue } = this.props;
    const { cloudimgURL, cloudimgSRCSET, height, loaded, processed } = this.state;

    if (this.server) return <img alt={this.props.alt} src={BASE_64_PLACEHOLDER}/>;
    if (!processed) return <div/>;

    const {
      alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, doNotReplaceURL, ...otherProps
    } = getFilteredProps(this.props);

    const picture = (
      <img
        className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
        src={cloudimgURL}
        srcSet={cloudimgSRCSET.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ')}
        alt={alt}
        onLoad={this.onImgLoad}
        {...otherProps}
      />
    );

    return lazyLoading ? (
      <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
        {picture}
      </LazyLoad>
    ) : picture;
  }
}


export default Img;