import { useContext } from 'react';
import ImgComponent from '../img';
import BackgroundImgComponent from '../background';
import CloudimageProvider, { CloudimageContext } from '../provider';


function Img(props) {
  const cloudImageContext = useContext(CloudimageContext);

  return (
    <ImgComponent {...props} config={cloudImageContext.cloudImageConfig} />
  );
}

function BackgroundImg(props) {
  const cloudImageContext = useContext(CloudimageContext);

  return (
    <BackgroundImgComponent {...props} config={cloudImageContext.cloudImageConfig} />
  );
}

export default Img;

export { CloudimageProvider, Img, BackgroundImg };
