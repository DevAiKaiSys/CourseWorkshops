import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Package';
import Login from './pages/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import User from './pages/User';
import Sale from './pages/Sale';
import BillSales from './pages/BillSales';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Package />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/user',
    element: <User />,
  },
  {
    path: '/sale',
    element: <Sale />,
  },
  {
    path: '/billSale',
    element: <BillSales />,
  },
  // {
  //   path: '/sale',
  //   element: <Sale />,
  // },
  // {
  //   path: '/sale',
  //   element: <Sale />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  // <Package />
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
