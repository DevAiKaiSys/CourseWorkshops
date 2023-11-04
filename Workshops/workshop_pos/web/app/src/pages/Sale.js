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

  const handleSave = async (req, res) => {
    try {
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
            {/* <div className="input-group mt-3">
              <span className="input-group-text">Barcode</span>
              <input type="text" className="form-control" />
              <button className="btn btn-primary">
                <i className="fa fa-check mr-2"></i>บันทึก
              </button>
            </div> */}

            <div className="row">
              <div className="col-9">
                <div className="row">
                  {products.length > 0
                    ? products.map((item) => (
                        <div className="col-3">
                          <div className="card">
                            <img
                              src={`${config.api_path}/uploads/${item.productImages[0].imageName}`}
                              class="card-img-top"
                              alt=""
                              // width="100px"
                              height="150px"
                              // style={{ width: '100px', height: '100px' }}
                            />
                            <div className="card-body text-center">
                              <div className="text-primary">{item.name}</div>
                              <h3 className="mt-3">{item.price}</h3>
                            </div>
                          </div>
                        </div>
                      ))
                    : ''}
                </div>
              </div>
              <div className="col-3">
                <div className="text-right">
                  {/* <span className="bg-dark text-success h1 px-3">0.00</span> */}
                  <div
                    className="h1 px-3"
                    style={{ color: '#70FE3F', backgroundColor: 'black' }}
                  >
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </div>
  );
};

export default Sale;
