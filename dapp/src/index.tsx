import React from 'react';
import ReactDOM from 'react-dom';
import nightwind from "nightwind/helper"
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles.scss';
import { App } from './App';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <script defer dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
