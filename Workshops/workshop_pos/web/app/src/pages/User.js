import React from 'react';
import Template from '../components/Template';
import Modal from '../components/Modal';

function User() {
  const handleSave = () => {};

  return (
    <>
      <Template>
        <div className="card">
          <h5 className="card-header">ผู้ใช้งานระบบ</h5>
          <div className="card-body">
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#modalUser"
              // onClick={(e) => setProduct({})}
            >
              <i className="fa fa-plus mr-2"></i>เพิ่มรายการ
            </button>
            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  {/* <th>barcode</th>
                <th>ชื่อสินค้า</th>
                <th className="text-right">ราคาทุน</th>
                <th className="text-right">ราคาจำหน่าย</th>
                <th>รายละเอียด</th>
                <th width="170px">action</th> */}
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

      <Modal id="modalUser" title="ผู้ใช้งานระบบ" modalSize="modal-lg">
        <form onSubmit={handleSave}>
          <div className="mt-3 ">
            <label>ชื่อ</label>
            <input className="form-control" />
          </div>
          <div className="mt-3 ">
            <label>username</label>
            <input className="form-control" />
          </div>
          <div className="mt-3 ">
            <label>password</label>
            <input type="password" className="form-control" />
          </div>
          <div className="mt-3 ">
            <label>ยืนยัน password</label>
            <input type="password" className="form-control" />
          </div>
          <div className="mt-3 ">
            <label>ระดับ</label>
            <select name="" id="" className="form-control">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary">
              <i className="fa fa-check mr-2"></i>Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default User;
