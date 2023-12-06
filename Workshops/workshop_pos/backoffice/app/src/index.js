import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import ReportMember from './pages/ReportMember';
import ReportChangePackage from './pages/ReportChangePackage';
import ReportSumSalePerDay from './pages/ReportSumSalePerDay';
import ReportSumSalePerMonth from './pages/ReportSumSalePerMonth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/reportMember',
    element: <ReportMember />,
  },
  {
    path: '/reportChangePackage',
    element: <ReportChangePackage />,
  },
  {
    path: '/reportSumSalePerDay',
    element: <ReportSumSalePerDay />,
  },
  {
    path: '/reportSumSalePerMonth',
    element: <ReportSumSalePerMonth />,
  },
  // {
  //   path: '/reportSumSalePerDay',
  //   element: <ReportSumSalePerDay />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
