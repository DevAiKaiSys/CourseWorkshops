import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});

  useEffect(() => {
    fetchData();
    openBill();
  }, []);

  const openBill = async () => {
    try {
      await axios
        .get(`${config.api_path}/billSale/openBill`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setBillSale(res.data.result);
          }
        });
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
        timer: 2000,
      });
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/product/listForSale`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setProducts(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
        timer: 2000,
      });
    }
  };

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">
            <div className="float-left">ขายสินค้า</div>
            <div className="float-right">
              <button className="btn btn-success mr-2">
                <i className="fa fa-check mr-2"></i>จบการขาย
              </button>
              <button className="btn btn-info mr-2">
                <i className="fa fa-file mr-2"></i>บิลวันนี้
              </button>
              <button className="btn btn-secondary">
                <i className="fa fa-file-alt mr-2"></i>บิลล่าสุด
              </button>
            </div>
          </h5>
          <div className="card-body">
            <div className="text-right">
              {/* <span className="bg-dark text-success h1 px-3">0.00</span> */}
              <span
                className="h1 px-3"
                style={{ color: '#70FE3F', backgroundColor: 'black' }}
              >
                0.00
              </span>
            </div>

            <div className="input-group mt-3">
              <span className="input-group-text">Barcode</span>
              <input type="text" className="form-control" />
              <button className="btn btn-primary">
                <i className="fa fa-check mr-2"></i>บันทึก
              </button>
            </div>

            <table className="mt-3 table table-bordered table-striped mt-3">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>barcode</th>
                  <th>รายการ</th>
                  <th className="text-right">ราคา</th>
                  <th className="text-right">จำนวน</th>
                  <th width="100px">action</th>
                </tr>
              </thead>
              <tbody>
                {/* {products.length > 0 ? (
                  products.map((item, index) => (
                    <tr key={index}>
                      <td>{item.barcode}</td>
                      <td>{item.name}</td>
                      <td className="text-right">
                        {parseInt(item.cost).toLocaleString('th-TH')}
                      </td>
                      <td className="text-right">
                        {parseInt(item.price).toLocaleString('th-TH')}
                      </td>
                      <td>{item.detail}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary mr-2"
                          // onClick={(e) => {
                          //   setProduct(item);
                          //   // fetchDataProductImage();
                          // }}
                          onClick={(e) => handleChooseProduct(item)}
                          data-toggle="modal"
                          data-target="#modalProductImage"
                        >
                          <i className="fa fa-image"></i>
                        </button>
                        <button
                          className="btn btn-info mr-2"
                          onClick={(e) => setProduct(item)}
                          data-toggle="modal"
                          data-target="#modalProduct"
                        >
                          <i className="fa fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => handleDelete(item)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No products available.
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </Template>
    </div>
  );
};

export default Sale;
