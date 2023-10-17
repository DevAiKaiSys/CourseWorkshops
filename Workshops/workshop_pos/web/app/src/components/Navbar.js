import React, { useState } from 'react';
import config from '../config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import axios, { Axios } from 'axios';

function Navbar() {
  const [memberName, setMemberName] = useState('');

  const navigate = useNavigate();

  const handleSignOut = () => {
    Swal.fire({
      title: 'sign out',
      text: 'ยืนยันการออกจากระบบ',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate('/login');
      }
    });
  };

  const handleEditProfile = async () => {
    try {
      axios
        .get(config.api_path + '/member/info', config.headers())
        .then((res) => {
          if (res.data.message === 'success') {
            setMemberName(res.data.result.name);
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
      });
    }
  };

  const handleChangeSave = async () => {
    try {
      const url = config.api_path + '/member/changeProfile';
      const payload = { memberName: memberName };
      await axios.put(url, payload, config.headers()).then((res) => {
        if (res.data.message === 'success') {
          Swal.fire({
            title: 'เปลี่ยนข้อมูล',
            text: 'เปลี่ยนแปลงข้อมูลร้านของคุณแล้ว',
            icon: 'success',
            timer: 2000,
          });
        }
      });
    } catch (e) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          {/* <li className="nav-item d-none d-sm-inline-block">
          <a href="index3.html" className="nav-link">
            Home
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">
            Contact
          </a>
        </li> */}
        </ul>

        {/* <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="navbar-search"
            href="#"
            role="button"
          >
            <i className="fas fa-search"></i>
          </a>
          <div className="navbar-search-block">
            <form className="form-inline">
              <div className="input-group input-group-sm">
                <input
                  className="form-control form-control-navbar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-navbar" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                  <button
                    className="btn btn-navbar"
                    type="button"
                    data-widget="navbar-search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-comments"></i>
            <span className="badge badge-danger navbar-badge">3</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user1-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 mr-3 img-circle"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                    <span className="float-right text-sm text-danger">
                      <i className="fas fa-star"></i>
                    </span>
                  </h3>
                  <p className="text-sm">Call me whenever you can...</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"></i> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user8-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    John Pierce
                    <span className="float-right text-sm text-muted">
                      <i className="fas fa-star"></i>
                    </span>
                  </h3>
                  <p className="text-sm">I got your message bro</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"></i> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <div className="media">
                <img
                  src="dist/img/user3-128x128.jpg"
                  alt="User Avatar"
                  className="img-size-50 img-circle mr-3"
                />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Nora Silvester
                    <span className="float-right text-sm text-warning">
                      <i className="fas fa-star"></i>
                    </span>
                  </h3>
                  <p className="text-sm">The subject goes here</p>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1"></i> 4 Hours Ago
                  </p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item dropdown-footer">
              See All Messages
            </a>
          </div>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-bell"></i>
            <span className="badge badge-warning navbar-badge">15</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">
              15 Notifications
            </span>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope mr-2"></i> 4 new messages
              <span className="float-right text-muted text-sm">3 mins</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-users mr-2"></i> 8 friend requests
              <span className="float-right text-muted text-sm">12 hours</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-file mr-2"></i> 3 new reports
              <span className="float-right text-muted text-sm">2 days</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item dropdown-footer">
              See All Notifications
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            href="#"
            role="button"
          >
            <i className="fas fa-th-large"></i>
          </a>
        </li>
      </ul> */}

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button
              className="btn btn-info mr-2"
              onClick={handleEditProfile}
              data-toggle="modal"
              data-target="#modalEditProfile"
            >
              <i className="fa fa-user mr-2"></i>Profile
            </button>
            <button className="btn btn-danger" onClick={handleSignOut}>
              <i className="fa fa-times mr-2"></i>Signout
            </button>
          </li>
        </ul>
      </nav>

      {/* ** Modal ต้องอยู่นอก tag nav */}
      <Modal id="modalEditProfile" title="แก้ไขข้อมูลร้านของฉัน">
        <div>
          <label>ชื่อร้าน</label>
          <input
            className="form-control"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleChangeSave}>
            <i className="fa fa-check mr-2"></i>Save
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
