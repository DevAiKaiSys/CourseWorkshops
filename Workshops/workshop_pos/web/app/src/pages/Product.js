import React, { useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import Modal from '../components/Modal';

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios
        .post(config.api_path + '/product/insert', product, config.headers())
        .then((res) => {
          if (res.status === 201) {
            Swal.fire({
              title: 'บันทึกข้อมูล',
              text: 'บันทึกข้อมูลสินค้าแล้ว',
              icon: 'success',
              timer: 2000,
            });
          }
        });
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'warning',
        timer: 2000,
      });
    }
  };

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">สินค้า</h5>
          <div className="card-body">
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#modalProduct"
            >
              <i className="fa fa-plus mr-2"></i>เพิ่มรายการ
            </button>
          </div>
        </div>
      </Template>

      <Modal id="modalProduct" title="สินค้า" modalSize="modal-lg">
        <form onSubmit={handleSave}>
          <div className="row">
            <div className="mt-3 col-2">
              <label>barcode</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    barcode: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-3 col-10">
              <label>ชื่อสินค้า</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-3 col-2">
              <label>ราคาจำหน่าย</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-3 col-2">
              <label>ราคาทุน</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    cost: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-3 col-8">
              <label>รายละเอียด</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    detail: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary">
              <i className="fa fa-check mr-2"></i>Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Product;
