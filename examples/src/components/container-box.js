import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { debounce } from 'throttle-debounce';


function ContainerBox({ isHeight }) {
  const [width, setWidth] = useState('---');
  const [height, setHeight] = useState('---');

  const box = useRef();

  const setContainerWidthAndHeight =() => {
    setWidth(box.current.parentNode.offsetWidth);
    setHeight(box.current.parentNode.offsetHeight);
  };

  useEffect(() => {
    setContainerWidthAndHeight();

    window.addEventListener('resize', debounce(400, () => {
      setContainerWidthAndHeight();
    }));

    return () => {
      window.removeEventListener('resize', debounce);
    };
  }, []);

  return (
    <div
      ref={box}
      className="container-width-box"
    >
      container
      {isHeight ? '' : 'width:'}
      <span>{width}</span>
      {isHeight ? `x ${height}` : ''}
      {' '}
      px
    </div>
  );
}

export default ContainerBox;
