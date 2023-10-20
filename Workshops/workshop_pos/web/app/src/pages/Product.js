import React, { useEffect, useState } from 'react';
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
      const response = await axios.post(
        `${config.api_path}/product/insert`,
        product,
        config.headers()
      );

      if (response.status === 201) {
        Swal.fire({
          title: 'บันทึกข้อมูล',
          text: 'บันทึกข้อมูลสินค้าแล้ว',
          icon: 'success',
          timer: 2000,
        });

        // Reset the product object
        setProduct({});

        // Fetch data after successful save
        fetchData();

        // Close modal (if you're using Bootstrap modal)
        const closeModalButton = document.getElementById('btnModalClose');
        closeModalButton && closeModalButton.click();
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + '/product/list', config.headers())
        .then((res) => {
          if (res.status === 200) {
            setProducts(res.data.results);
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
            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>barcode</th>
                  <th>ชื่อสินค้า</th>
                  <th className="text-right">ราคาทุน</th>
                  <th className="text-right">ราคาจำหน่าย</th>
                  <th>รายละเอียด</th>
                  <th width="150px">action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
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
                        <button className="btn btn-info">
                          <i className="fa fa-pencil-alt"></i>
                        </button>
                        <button className="btn btn-danger ml-2">
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
                )}
              </tbody>
            </table>
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
