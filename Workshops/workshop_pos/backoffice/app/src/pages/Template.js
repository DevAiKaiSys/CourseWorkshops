import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import config from '../config';
import Modal from '../components/Modal';

function Template(props) {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  const [usr, setUsr] = useState('');
  const [pwd, setUPwd] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/admin/info`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setAdmin(res.data.result);
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

  const handleSignOut = () => {
    Swal.fire({
      title: 'Sign out',
      text: 'คุณต้องการออกจากระบบ ใช่หรือไม่',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate('/');
      }
    });
  };

  const handleChangeProfile = async () => {
    Swal.fire({
      title: 'เปลี่ยนข้อมูลส่วนตัว',
      text: 'ยืนยันการเปลี่ยนแปลงข้อมูล',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const payload = { usr: usr, id: admin.id };
          if (pwd != '') {
            payload.pwd = pwd;
          }
          await axios
            .post(
              `${config.api_path}/admin/changeProfile`,
              payload,
              config.headers()
            )
            .then((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: 'บันทึกข้อมูล',
                  text: 'บันทึกข้อมูลแล้ว',
                  icon: 'success',
                  timer: 1000,
                }).then((res) => {
                  handleCloseModal();

                  localStorage.removeItem(config.token_name);
                  navigate('/');
                });
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

  const handleCloseModal = () => {
    const modalElements = document.querySelectorAll('.modal.show');

    modalElements.forEach((element) => {
      const elementsWithIdClose = element.querySelectorAll('#btnModalClose');

      // Step 3: Loop through all elements and child elements with id="btnModalClose"
      elementsWithIdClose.forEach((element) => {
        element.click();
      });
    });
  };

  return (
    <>
      <div className="d-flex">
        <div
          className="bg-dark vh-100 px-3 pt-2 position-fixed"
          style={{ width: '300px' }}
        >
          <div className="text-white ms-2">
            <h5 className="text-warning">
              {admin.name} : {admin.level}
            </h5>
            <div className="mt-3">
              <button
                className="btn btn-outline-warning me-2"
                onClick={handleSignOut}
              >
                <i className="fa fa-times me-2"></i>
                Sign Out
              </button>
              <button
                className="btn btn-outline-info"
                data-bs-toggle="modal"
                data-bs-target="#modalMyInfo"
                onClick={() => setUsr(admin.usr)}
              >
                <i className="fa fa-pencil me-2"></i>
                Edit Info
              </button>
            </div>
            <hr className="mt-4" />
          </div>
          <div className="d-grid gap-3 mt-2">
            <Link
              to="/home"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-dashboard me-3"></i>
              Dashboard
            </Link>
            <Link
              to="/reportMember"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานคนที่สมัครใช้บริการ
            </Link>
            <Link
              to="/reportChangePackage"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานคนที่ขอเปลี่ยน แพคเกจ
            </Link>
            <Link
              to="/reportSumSalePerDay"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายวัน
            </Link>
            <Link
              to="/reportSumSalePerMonth"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายเดือน
            </Link>
            <Link
              to="/reportSumSalePerYear"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายปี
            </Link>
            <Link
              to="/admin"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-user me-3"></i>
              ผู้ใช้ระบบ
            </Link>
          </div>
        </div>
        <div
          className="p-3 w-100 overflow-auto"
          style={{ marginLeft: '300px' }}
        >
          {props.children}
        </div>
      </div>

      <Modal id="modalMyInfo" title="เปลี่ยนข้อมูลส่วนตัว">
        <div>
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={usr}
            onChange={(e) => setUsr(e.target.value)}
          />
        </div>
        <div className="mt=3">
          <label>password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setUPwd(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleChangeProfile}>
            <i className="fa fa-check me-2"></i>บันทึก
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Template;
