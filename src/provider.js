import {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { debounce } from 'throttle-debounce';
import { CONSTANTS, processParams } from 'cloudimage-responsive-utils';


const CloudimageContext = createContext({ cloudImageConfig: {} });

function CloudimageProvider({ config = {}, children } = {}) {
  const {
    token = '',
    domain = config.customDomain || 'cloudimg.io',
    customDomain = false,
    lazyLoading = true,
    lazyLoadOffset = 100,
    baseUrl, // to support old name
    baseURL,
    apiVersion = 'v7',
    presets,
    params = 'org_if_sml=1',
    imageSizeAttributes = 'use',
    exactSize = false,
    doNotReplaceURL = false,
    limitFactor = 100,
    devicePixelRatioList = CONSTANTS.DEVICE_PIXEL_RATIO_LIST,
  } = config;

  const [cloudImageConfig, setCloudImageConfig] = useState({
    token,
    domain,
    customDomain,
    lazyLoading,
    lazyLoadOffset,
    baseURL: baseUrl || baseURL,
    apiVersion,
    exactSize,
    presets: presets || {
      xs: '(max-width: 575px)', // to 575       PHONE
      sm: '(min-width: 576px)', // 576 - 767    PHABLET
      md: '(min-width: 768px)', // 768 - 991    TABLET
      lg: '(min-width: 992px)', // 992 - 1199   SMALL_LAPTOP_SCREEN
      xl: '(min-width: 1200px)', // from 1200    USUALSCREEN
    },
    params: processParams(params),
    innerWidth: typeof window !== 'undefined' ? window.innerWidth : null,
    previewQualityFactor: 10,
    doNotReplaceURL,
    devicePixelRatioList,
    limitFactor,
    imageSizeAttributes,
  });

  const updateDimensions = debounce(100, () => {
    setCloudImageConfig({ ...cloudImageConfig, innerWidth: window.innerWidth });
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <CloudimageContext.Provider
      value={useMemo(() => ({ cloudImageConfig }), [cloudImageConfig])}
    >
      {children}
    </CloudimageContext.Provider>
  );
}

export { CloudimageContext };
export default CloudimageProvider;
