import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios, { Axios } from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import Modal from '../components/Modal';

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productImage, setProductImage] = useState();
  const [productImages, setProductImages] = useState([]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let url = '/product/insert';
      if (product.id) {
        url = '/product/update';
      }
      const response = await axios.post(
        `${config.api_path}${url}`,
        product,
        config.headers()
      );

      if (response.status === 201 || response.status === 200) {
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

        handleCloseModal();
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

  const handleCloseModal = () => {
    // const btns = document.getElementsByClassName('btnModalClose');
    // Array.from(btns).forEach((btn) => {
    //   console.log(btn);
    //   btn.click();
    // });

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

  const handleDelete = (item) => {
    Swal.fire({
      title: 'ลบข้อมูล',
      text: 'ยืนยันการลบข้อมูลออกจากระบบ',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const response = await axios.delete(
            `${config.api_path}/product/delete/${item.id}`,
            config.headers()
          );
          if (response.status === 200) {
            Swal.fire({
              title: 'ลบข้อมูล',
              text: 'ลบข้อมูลสินค้าแล้ว',
              icon: 'success',
              timer: 2000,
            });
            fetchData();
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

  const handleChangeFile = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const _config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem(config.token_name),
          'content-type': 'multipart/form-data',
        },
      };
      const formData = new FormData();
      formData.append('productImage', productImage);
      formData.append('productImageName', productImage.name);
      formData.append('productId', product.id);

      await axios
        .post(config.api_path + '/productImage/insert', formData, _config)
        .then((res) => {
          if (res.status === 201) {
            Swal.fire({
              title: 'upload ภาพสินค้า',
              text: 'upload ภาพสิรค้าเรียบร้อยแล้ว',
              icon: 'success',
              timer: 2000,
            });

            fetchDataProductImage();

            handleCloseModal();
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

  const fetchDataProductImage = async () => {};

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
              onClick={(e) => setProduct({})}
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
                  <th width="170px">action</th>
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
                        <button
                          className="btn btn-primary mr-2"
                          onClick={(e) => setProduct(item)}
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
                value={product.barcode}
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
                value={product.name}
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
                value={product.price}
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
                value={product.cost}
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
                value={product.detail}
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

      <Modal id="modalProductImage" title="ภาพสินค้า" modalSize="modal-lg">
        <form onSubmit={handleUpload}>
          <div className="row">
            <div className="col-4">
              <div>barcode</div>
              <input
                className="form-control"
                value={product.barcode}
                disabled
              />
            </div>
            <div className="col-8">
              <div>ชื่อสินค้า</div>
              <input className="form-control" value={product.name} disabled />
            </div>

            <div className="col-12 mt-3">
              <div>รายละเอียด</div>
              <input className="form-control" value={product.detail} disabled />
            </div>

            <div className="col-12 mt-3">
              <div>เลือกภาพสินค้า</div>
              <input
                type="file"
                name="imageName"
                className="form-control"
                onChange={handleChangeFile}
              />
            </div>
            {/* {productImage ? <div>File: {productImage.name}</div> : ''} */}
          </div>

          <div className="mt-3">
            {productImage ? (
              <button className="btn btn-primary">
                <i className="fa fa-check mr-2"></i>
                Upload and Save
              </button>
            ) : (
              ''
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Product;
