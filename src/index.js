import React, { forwardRef, useCallback, useContext } from 'react';

import BackgroundImgComponent from './background';
import CloudimageProvider, { CloudimageContext } from './provider';
import ImgComponent from './img';
import './polyfills';


const Img = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callbackRef = useCallback((node) => {
    if (node && ref) {
      ref = node.current;
    }
  }, []);

  return (
    <ImgComponent innerRef={callbackRef} {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

const BackgroundImg = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callBackRef = useCallback((node) => {
    if (node && ref) {
      ref.current = node;
    }
  }, []);

  return (
    <BackgroundImgComponent innerRef={callBackRef} {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

export default Img;

export { CloudimageProvider, Img, BackgroundImg };
