import React, { Children, useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config';
import Modal from '../components/Modal';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});
  const [currentBill, setCurrentBill] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [item, setItem] = useState({});
  const [inputMoney, setInputMoney] = useState(0);
  const [lastBill, setLastBill] = useState({});

  useEffect(() => {
    fetchData();
    openBill();
    fetchBillSaleDetail();
  }, []);

  const fetchBillSaleDetail = async () => {
    try {
      await axios
        .get(`${config.api_path}/billSale/currentBillInfo`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setCurrentBill(res.data.result);
            sumTotalPrice(res.data.result);
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

  const sumTotalPrice = (currentBill) => {
    let sum = 0;
    if (currentBill?.billSaleDetails?.length > 0) {
      for (let i = 0; i < currentBill.billSaleDetails.length; i++) {
        const item = currentBill.billSaleDetails[i];
        const qty = parseInt(item.qty);
        const price = parseInt(item.price);

        sum += qty * price;
      }
    }

    setTotalPrice(sum);
  };

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

  const handleSave = async (item) => {
    try {
      await axios
        .post(`${config.api_path}/billSale/sale`, item, config.headers())
        .then((res) => {
          if (res.status === 200) {
            fetchBillSaleDetail();
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

  const handleDelete = (item) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบรายการนี้ใช่หรือไม่',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .delete(
              `${config.api_path}/billSale/deleteItem/${item.id}`,
              config.headers()
            )
            .then((res) => {
              if (res.status === 200) {
                fetchBillSaleDetail();
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
      }
    });
  };

  const handleUpdateQty = async (item) => {
    try {
      await axios
        .post(`${config.api_path}/billSale/updateQty`, item, config.headers())
        .then((res) => {
          if (res.status === 200) {
            fetchBillSaleDetail();
            handleCloseModal();
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

  const handleCloseModal = () => {
    const modalElement = document.querySelector('.modal.show');

    // Step 2: Find all elements and child elements with id="btnModalClose" inside the modal element
    if (modalElement) {
      const elementsWithIdClose =
        modalElement.querySelectorAll('#btnModalClose');

      // Step 3: Loop through all elements and child elements with id="btnModalClose"
      elementsWithIdClose.forEach((element) => {
        element.click();
      });

      // You can perform further operations on elementsWithIdClose if needed
    } else {
      console.log('Modal element with class "modal fade show" not found.');
    }
  };

  const handleEndSale = () => {
    Swal.fire({
      title: 'จบการขาย',
      text: 'ยืนยันจบการขาย',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .get(`${config.api_path}/billSale/endSale`, config.headers())
            .then((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: 'จบการขาย',
                  text: 'จบการขายสำเร็วแล้ว',
                  timer: 1000,
                });

                openBill();
                fetchBillSaleDetail();

                handleCloseModal();
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
      }
    });
  };

  const handleLastBill = async () => {
    try {
      await axios
        .get(`${config.api_path}/billSale/lastBill`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setLastBill(res.data.result);
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
              <button
                className="btn btn-success mr-2"
                data-toggle="modal"
                data-target="#modelEndSale"
              >
                <i className="fa fa-check mr-2"></i>จบการขาย
              </button>
              <button className="btn btn-info mr-2">
                <i className="fa fa-file mr-2"></i>บิลวันนี้
              </button>
              <button className="btn btn-secondary" onClick={handleLastBill}>
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
                    ? products.map((item, index) => (
                        <div
                          className="col-3"
                          key={index}
                          onClick={() => handleSave(item)}
                        >
                          <div className="card">
                            <img
                              src={`${config.api_path}/uploads/${item.productImages[0].imageName}`}
                              className="card-img-top"
                              alt=""
                              // width="100px"
                              height="150px"
                              // style={{ width: '100px', height: '100px' }}
                            />
                            <div className="card-body text-center">
                              <div className="text-primary">{item.name}</div>
                              <h3 className="mt-3">
                                {parseInt(item.price).toLocaleString('th-TH')}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ))
                    : ''}
                </div>
              </div>
              <div className="col-3">
                <div className="">
                  {/* <span className="bg-dark text-success h1 px-3">0.00</span> */}
                  <div
                    className="h1 px-3 text-right py-3"
                    style={{ color: '#70FE3F', backgroundColor: 'black' }}
                  >
                    {totalPrice.toLocaleString('th-TH')}
                  </div>
                  {currentBill?.billSaleDetails?.length > 0 &&
                    currentBill.billSaleDetails.map((item, index) => (
                      <div className="card" key={index}>
                        <div className="card-body">
                          <div>{item.product.name}</div>
                          <div>
                            <span
                              className="text-danger font-weight-bolder mr-3"
                              style={{ fontSize: '30px' }}
                            >
                              {item.qty}
                            </span>{' '}
                            x{' '}
                            <span className="mx-2">
                              {parseInt(item.price).toLocaleString('th-TH')}
                            </span>{' '}
                            ={' '}
                            <span className="ml-2">
                              {parseInt(item.qty * item.price).toLocaleString(
                                'th-TH'
                              )}
                            </span>
                            <div className="text-center">
                              <button
                                className="btn btn-primary"
                                onClick={() => setItem(item)}
                                data-toggle="modal"
                                data-target="#modalQty"
                              >
                                <i className="fa fa-pencil-alt"></i>
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(item)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>

      <Modal id="modalQty" title="ปรับจำนวน">
        <div>
          <label>จำนวน</label>
          <input
            type="text"
            className="form-control"
            value={item.qty}
            onChange={(e) => setItem({ ...item, qty: e.target.value })}
          />

          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() => handleUpdateQty(item)}
            >
              <i className="fa fa-check mr-2"></i>
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="modelEndSale" title="จบการขาย">
        <div>
          <div>
            <label>ยอดเงินทั้งหมด</label>
          </div>
          <div>
            <input
              className="form-control text-right"
              value={totalPrice.toLocaleString('th-TH')}
              disabled
            />
          </div>
          <div className="mt-3">
            <label>รับเงิน</label>
          </div>
          <div>
            <input
              className="form-control text-right"
              value={inputMoney}
              onChange={(e) => setInputMoney(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label>เงินทอน</label>
          </div>
          <div>
            <input
              className="form-control text-right"
              value={(inputMoney - totalPrice).toLocaleString('th-TH')}
              disabled
            />
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setInputMoney(totalPrice)}
            >
              <i className="fa fa-check mr-2"></i>
              จ่ายพอดี
            </button>
            <button className="btn btn-success" onClick={handleEndSale}>
              <i className="fa fa-check mr-2"></i>
              จบการขาย
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sale;
