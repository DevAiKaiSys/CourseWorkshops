import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';

function User() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + '/user/list', config.headers())
        .then((res) => {
          if (res.status === 200) {
            setUsers(res.data.results);
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

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // console.log(user);
      const response = await axios.post(
        `${config.api_path}/user/insert`,
        user,
        config.headers()
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: 'บันทึกข้อมูล',
          text: 'บันทึกข้อมูลเข้าระบบแล้ว',
          icon: 'success',
          timer: 2000,
        });

        // Reset the user object
        setUser({});

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
    } else {
      console.log('Modal element with class "modal fade show" not found.');
    }
  };

  const clearForm = () => {
    setUser({});
  };

  useEffect(() => {
    comparePassword();
  }, [user.password, user.passwordConfirm]);

  const comparePassword = () => {
    if (user.password?.length > 0 && user.passwordConfirm?.length > 0) {
      if (user.password != user.passwordConfirm) {
        Swal.fire({
          title: 'ตรวจสอบการกรอกรหัสผ่าน',
          text: 'รหัสผ่านไม่ตรงกัน',
          icon: 'error',
        });
      } else {
        setUser({ ...user, pwr: user.password });
      }
    }
  };

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
                  <th>ชื่อสินค้า</th>
                  <th>user</th>
                  <th>ระดับ</th>
                  <th width="170px">action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.usr}</td>
                      <td>{item.level}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-info mr-2"
                          // onClick={(e) => setUser(item)}
                          // data-toggle="modal"
                          // data-target="#modalUser"
                        >
                          <i className="fa fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          // onClick={(e) => handleDelete(item)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No User available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalUser" title="ผู้ใช้งานระบบ" modalSize="modal-lg">
        <form onSubmit={handleSave}>
          <div className="mt-3 ">
            <label>ชื่อ</label>
            <input
              className="form-control"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="mt-3 ">
            <label>username</label>
            <input
              className="form-control"
              onChange={(e) => setUser({ ...user, usr: e.target.value })}
            />
          </div>
          <div className="mt-3 ">
            <label>password</label>
            <input
              type="password"
              className="form-control"
              onBlur={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="mt-3 ">
            <label>ยืนยัน password</label>
            <input
              type="password"
              className="form-control"
              onBlur={(e) =>
                setUser({ ...user, passwordConfirm: e.target.value })
              }
            />
          </div>
          <div className="mt-3 ">
            <label>ระดับ</label>
            <select
              name=""
              id=""
              className="form-control"
              onChange={(e) => setUser({ ...user, level: e.target.value })}
            >
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
