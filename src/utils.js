export const getFilteredProps = ({
  config = {}, alt = '', className = '', src, sizes, width, height,
   ratio, params, lazyLoading, ...otherProps
}) => ({
  alt,
  className,
  imgNodeWidth: width,
  imgNodeHeight: height,
  ...otherProps
});

export const getFilteredBgProps = ({
  config = {}, alt = '', className = '', src, sizes, width, height, ratio, params, ...otherProps
}) => ({
  config,
  className,
  ...otherProps
});