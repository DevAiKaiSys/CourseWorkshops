import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import config from '../config';

function Template(props) {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

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

  return (
    <div>
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
                className="btn btn-outline-warning btn-lg"
                onClick={handleSignOut}
              >
                Sign Out
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
              to="/"
              className="btn btn-default text-secondary text-start my-menu"
            >
              <i className="fa fa-file-alt me-3"></i>
              รายงานรายได้รายปี
            </Link>
            <Link
              to="/"
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
    </div>
  );
}

export default Template;
