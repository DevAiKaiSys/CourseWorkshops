import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
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
    Swal.fire({
      title: 'ยืนยันการอัพโหลดภาพสินค้า',
      text: 'โปรดทำการยืนยัน เพื่ออัพโหลดภาพสินค้า',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const _config = {
            headers: {
              Authorization:
                'Bearer ' + localStorage.getItem(config.token_name),
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

                // fetchDataProductImage();
                fetchDataProductImage(product.id);

                // handleCloseModal();
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
      }
    });
  };

  // useEffect(() => {
  //   // This code will run after every render, including the initial render and after state updates
  //   if (product.id !== undefined) {
  //     console.log('Product in useEffect:', product);
  //     fetchDataProductImage();
  //   }
  // }, [product]); // The effect will re-run whenever the 'product' state variable changes

  // const fetchDataProductImage = async () => {
  const fetchDataProductImage = async (id) => {
    try {
      await axios
        .get(
          // `${config.api_path}/productImage/list/${product.id}`,
          `${config.api_path}/productImage/list/${id}`,
          config.headers()
        )
        .then((res) => {
          if (res.status === 200) {
            setProductImages(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
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

  const handleChooseProduct = (item) => {
    setProduct(item);
    fetchDataProductImage(item.id);
  };

  const handleChooseMainImage = (item) => {
    Swal.fire({
      title: 'เลือกภาพหลัก',
      text: 'ยืนยันการเลือกภาพนี้ เป็นภาพหลักของสินค้า',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const payload = { id: item.id, productId: item.productId };
          await axios
            .put(
              `${config.api_path}/productImage/chooseMainImage`,
              payload,
              config.headers()
            )
            .then((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: 'เลือกภาพหลัก',
                  text: 'บันทึกการเลือกภาหลักของสินค้าแล้ว',
                  icon: 'success',
                  timer: 2000,
                });
                // fetchDataProductImage();
                fetchDataProductImage(item.productId);
              }
            })
            .catch((err) => {
              throw err.response.data;
            });
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

  const handleDeleteProductImage = (item) => {
    Swal.fire({
      title: 'ลบภาพสินค้า',
      text: 'ยืนยันการลบภาพสินค้า',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const response = await axios.delete(
            `${config.api_path}/productImage/delete/${item.id}`,
            config.headers()
          );
          if (response.status === 200) {
            fetchDataProductImage(item.productId);
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
                value={product.barcode ?? ''}
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
                value={product.name ?? ''}
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
                value={product.price ?? ''}
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
                value={product.cost ?? ''}
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
                value={product.detail ?? ''}
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
        <div className="row">
          <div className="col-4">
            <div>barcode</div>
            <input className="form-control" value={product.barcode} disabled />
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
            <button className="btn btn-primary" onClick={handleUpload}>
              <i className="fa fa-check mr-2"></i>
              Upload and Save
            </button>
          ) : (
            ''
          )}
        </div>

        <hr />
        <h5 className="mt-3">ภาพสินค้า</h5>
        <div className="row">
          {productImages.length > 0
            ? productImages.map((item, index) => (
                <div className="col-3" key={index}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      src={`${config.api_path}/uploads/${item.imageName}`}
                      alt=""
                      width="100%"
                    />
                    <div className="card-body text-center px-0">
                      {item.isMain ? (
                        <button className="btn btn-info" disabled>
                          <i className="fa fa-check mr-2"></i>
                          ภาพหลัก
                        </button>
                      ) : (
                        <button
                          className="btn btn-default"
                          onClick={() => handleChooseMainImage(item)}
                        >
                          ภาพหลัก
                        </button>
                      )}

                      <button
                        className="btn btn-danger ml-2"
                        onClick={(e) => handleDeleteProductImage(item)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : ''}
        </div>
      </Modal>
    </div>
  );
}

export default Product;
