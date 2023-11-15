import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';

function Stock() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');

  // useEffect(() => {
  //   fetchData();
  // }, []);

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

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">รับสินค้าเข้า stock</h5>
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
                  <input type="number" className="form-control" />
                </div>
              </div>
              <div className="col-7">
                <button className="btn btn-primary">
                  <i className="fa fa-check mr-2"></i>
                  บันทึก
                </button>
              </div>
            </div>
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
