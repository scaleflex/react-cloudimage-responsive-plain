import React from 'react';
import ReactDOM from 'react-dom/client';
import { CloudimageProvider } from '../../src';
import App from './components/app';
import './style.css';


const cloudimageConfig = {
  token: 'demo',
  baseURL: 'https://scaleflex.cloudimg.io/v7/demo/',
  doNotReplaceURL: true,
  apiVersion: 'v7',
  params: 'ci_info=1&org_if_sml=1',
  lazyLoading: true,
  limitFactor: 10
};

const root = ReactDOM
.createRoot(document.getElementById("app"));

root.render(
  <CloudimageProvider config={cloudimageConfig}>
    <App />
  </CloudimageProvider>
);
