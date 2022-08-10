import React, { forwardRef, useCallback, useContext } from 'react';
import ImgComponent from '../img';
import BackgroundImgComponent from '../background';
import CloudimageProvider, { CloudimageContext } from '../provider';


const Img = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  return (
    <ImgComponent {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

const BackgroundImg = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callBackRef = useCallback((node) => {
    if(node && ref) {
      ref.current = node;
    }
  }, []);

  return ( 
    <BackgroundImgComponent innerRef={callBackRef} {...props} config={cloudImageContext.config } />
  );
});

export default Img;

export { CloudimageProvider, Img, BackgroundImg };
