import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import dayjs from 'dayjs';

function Stock() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState(0);
  const [qty, setQty] = useState(0);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchDataStock();
  }, []);

  const fetchDataStock = async () => {
    try {
      await axios
        .get(`${config.api_path}/stock/list`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setStocks(res.data.results);
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

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/product/list`, config.headers())
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

  const handleChooseProduct = (item) => {
    setProductName(item.name);
    setProductId(item.id);

    handleCloseModal();
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

  const handleSave = async () => {
    try {
      const payload = { qty: qty, productId: productId };
      const response = await axios
        .post(`${config.api_path}/stock/save`, payload, config.headers())
        .catch((err) => {
          throw err.response.data;
        });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: 'บันทึกข้อมูล',
          text: 'รับสินค้าเข้าสต๊อกแล้ว',
          icon: 'success',
          timer: 1000,
        });

        fetchDataStock();
        setQty(0);
        setProductName('');
      }
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'warning',
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
          const response = await axios
            .delete(
              `${config.api_path}/stock/delete/${item.id}`,
              config.headers()
            )
            .catch((err) => {
              throw err.response.data;
            });

          if (response.status === 200) {
            Swal.fire({
              title: 'ลบข้อมูล',
              text: 'ลบข้อมูลแล้ว',
              icon: 'success',
              timer: 1000,
            });

            fetchDataStock();
          }
        } catch (error) {
          Swal.fire({
            title: 'error',
            text: error.message,
            icon: 'warning',
            timer: 2000,
          });
        }
      }
    });
  };

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">รับสินค้าเข้า Stock</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text">สินค้า</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={productName}
                    disabled
                  />
                  <button
                    className="btn btn-primary"
                    onClick={fetchData}
                    data-toggle="modal"
                    data-target="#modalProduct"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text">จำนวน</label>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-7">
                <button className="btn btn-primary" onClick={handleSave}>
                  <i className="fa fa-check mr-2"></i>
                  บันทึก
                </button>
              </div>
            </div>

            <table className="table table-bordered table-triped mt-3">
              <thead>
                <tr>
                  <th width="150px">barcode</th>
                  <th>รายการ</th>
                  <th width="100px" className="text-right">
                    จำนวน
                  </th>
                  <th width="180px">วันที่</th>
                  <th width="100px"></th>
                </tr>
              </thead>
              <tbody>
                {stocks?.length > 0 &&
                  stocks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product.barcode}</td>
                      <td>{item.product.name}</td>
                      <td className="text-right">{item.qty}</td>
                      <td>
                        {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          <i className="fa fa-times mr-2"></i>ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalProduct" title="เลือกสินค้า" modalSize="modal-lg">
        <table className="table table-bordered table-triped">
          <thead>
            <tr>
              <th width="180px"></th>
              <th width="180px">barcode</th>
              <th>รายการ</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 &&
              products.map((item, index) => (
                <tr key={index}>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleChooseProduct(item)}
                    >
                      <i className="fa fa-check mr-2"></i>เลือกรายการ
                    </button>
                  </td>
                  <td>{item.barcode}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default Stock;
