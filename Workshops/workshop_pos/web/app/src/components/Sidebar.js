import axios from 'axios';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Swal from 'sweetalert2';
import config from '../config';
import { Link } from 'react-router-dom';
import Modal from './Modal';

// function Sidebar() {
const Sidebar = forwardRef((props, sidebarRef) => {
  useImperativeHandle(sidebarRef, () => ({
    refreshCountBill() {
      fetchDataTotalBill();
    },
  }));

  const [memberName, setMemberName] = useState();
  const [packageName, setPackageName] = useState();
  const [packages, setPackages] = useState([]);
  const [totalBill, setTotalBill] = useState(100);
  const [billAmount, setBillAmount] = useState(0);
  const [banks, setBanks] = useState([]);
  const [choosePackage, setChoosePackage] = useState({});

  useEffect(() => {
    fetchData();
    fetchDataTotalBill();
  }, []);

  const fetchData = async () => {
    try {
      axios
        .get(config.api_path + '/member/info', config.headers())
        .then((res) => {
          if (res.data.message === 'success') {
            setMemberName(res.data.result.name);
            setPackageName(res.data.result.package.name);
            setBillAmount(res.data.result.package.bill_amount);
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

  const fetchPackage = async () => {
    try {
      axios
        .get(`${config.api_path}/package/list`)
        .then((res) => {
          if (res.status === 200) {
            setPackages(res.data.results);
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

  const fetchDataTotalBill = async () => {
    try {
      axios
        .get(`${config.api_path}/package/countBill`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setTotalBill(res.data.totalBill);
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
  const readerButton = (item) => {
    if (packageName == item.name) {
      return (
        <button className="btn btn-primary btn-lg" disabled>
          <i className="fa fa-check mr-2"></i>
          เลือกแพคเกจ
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-primary btn-lg"
          data-toggle="modal"
          data-target="#modalBank"
          onClick={() => handleChoosePackage(item)}
        >
          <i className="fa fa-check mr-2"></i>
          เลือกแพคเกจ
        </button>
      );
    }
  };

  const handleChoosePackage = (item) => {
    setChoosePackage(item);
    fetchDataBank();
  };

  const fetchDataBank = async () => {
    if (!(banks?.length > 0)) {
      try {
        axios
          .get(`${config.api_path}/bank/list`, config.headers())
          .then((res) => {
            if (res.status === 200) {
              setBanks(res.data.results);
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
    }
  };

  const computePercent = (totalBill, billAmount) => {
    return (totalBill * 100) / billAmount;
  };

  const handleChangePackage = async () => {
    try {
      axios
        .get(
          `${config.api_path}/package/changePackage/${choosePackage.id}`,
          config.headers()
        )
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: 'ส่งข้อมูล',
              text: 'ส่งข้อมูลการขอเปลี่ยน แพคเกจ ของคุณแล้ว',
              icon: 'success',
              timer: 2000,
            });

            handleCloseModal();
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
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index3.html" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: 0.8 }}
          />
          <span className="brand-text font-weight-light">POS on Cloud</span>
        </a>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info text-white">
              {/* <a href="#" className="d-block">
              Alexander Pierce
            </a> */}
              <div>{memberName}</div>
              <div>Package: {packageName}</div>
              <div className="d-grid">
                <button
                  className="btn btn-warning mt-2"
                  data-toggle="modal"
                  data-target="#modalPackage"
                  onClick={fetchPackage}
                >
                  <i className="fa fa-arrow-up mr-2"></i>
                  Upgrade
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="mx-2 text-white">
              <div className="float-left">
                {totalBill} / {parseInt(billAmount).toLocaleString('th-TH')}
              </div>
              <div className="float-right">
                {computePercent(totalBill, billAmount)}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="progress mx-2">
              <div
                className="progress-bar"
                role="progressbar"
                // style={{ width: '25%;' }}
                // aria-valuenow="25"
                // aria-valuemin="0"
                // aria-valuemax="100"
                style={{ width: computePercent(totalBill, billAmount) + '%' }}
                aria-valuenow={totalBill}
                aria-valuemin={0}
                aria-valuemax={billAmount}
              ></div>
            </div>
          </div>

          {/* <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div> */}

          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* <li className="nav-item menu-open">
              <a href="#" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Dashboard
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="./index.html" className="nav-link active">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Dashboard v1</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="./index2.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Dashboard v2</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="./index3.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Dashboard v3</p>
                  </a>
                </li>
              </ul>
            </li> */}
              {/* <li className="nav-item">
              <a href="pages/widgets.html" className="nav-link">
                <i className="nav-icon fas fa-th"></i>
                <p>
                  Widgets
                  <span className="right badge badge-danger">New</span>
                </p>
              </a>
            </li> */}
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-th"></i>
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sale" className="nav-link">
                  <i className="nav-icon fas fa-dollar-sign"></i>
                  <p>ขายสินค้า</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/product" className="nav-link">
                  <i className="nav-icon fas fa-box"></i>
                  <p>สินค้า</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>ผู้ใช้งานระบบ</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sumSalePerDay" className="nav-link">
                  <i className="nav-icon fas fa-file-alt"></i>
                  <p>สรุปยอดขายรายวัน</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/billSales" className="nav-link">
                  <i className="nav-icon fas fa-list-alt"></i>
                  <p>รายงานบิลขาย</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stock" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>รับสินค้าเข้า Stock</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/reportStock" className="nav-link">
                  <i className="nav-icon fas fa-file"></i>
                  <p>รายงาน Stock</p>
                </Link>
              </li>
              {/* <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-copy"></i>
                <p>
                  Layout Options
                  <i className="fas fa-angle-left right"></i>
                  <span className="badge badge-info right">6</span>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/layout/top-nav.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Top Navigation</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/layout/top-nav-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Top Navigation + Sidebar</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/layout/boxed.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Boxed</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/layout/fixed-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Sidebar</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/layout/fixed-sidebar-custom.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Fixed Sidebar <small>+ Custom Area</small>
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/layout/fixed-topnav.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Navbar</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/layout/fixed-footer.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Footer</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/layout/collapsed-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Collapsed Sidebar</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  Charts
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/charts/chartjs.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>ChartJS</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/charts/flot.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/charts/inline.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Inline</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/charts/uplot.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>uPlot</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-tree"></i>
                <p>
                  UI Elements
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/UI/general.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/icons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Icons</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/buttons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Buttons</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/sliders.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Sliders</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/modals.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Modals & Alerts</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/navbar.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Navbar & Tabs</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/timeline.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Timeline</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/UI/ribbons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Ribbons</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-edit"></i>
                <p>
                  Forms
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/forms/general.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General Elements</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/forms/advanced.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Advanced Elements</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/forms/editors.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Editors</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/forms/validation.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Validation</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-table"></i>
                <p>
                  Tables
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/tables/simple.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Simple Tables</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/tables/data.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>DataTables</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/tables/jsgrid.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>jsGrid</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-header">EXAMPLES</li>
            <li className="nav-item">
              <a href="pages/calendar.html" className="nav-link">
                <i className="nav-icon far fa-calendar-alt"></i>
                <p>
                  Calendar
                  <span className="badge badge-info right">2</span>
                </p>
              </a>
            </li>
            <li className="nav-item">
              <a href="pages/gallery.html" className="nav-link">
                <i className="nav-icon far fa-image"></i>
                <p>Gallery</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="pages/kanban.html" className="nav-link">
                <i className="nav-icon fas fa-columns"></i>
                <p>Kanban Board</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-envelope"></i>
                <p>
                  Mailbox
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/mailbox/mailbox.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Inbox</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/mailbox/compose.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Compose</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/mailbox/read-mail.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Read</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-book"></i>
                <p>
                  Pages
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/examples/invoice.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Invoice</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/profile.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Profile</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/e-commerce.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>E-commerce</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/projects.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Projects</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/examples/project-add.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Add</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/examples/project-edit.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Edit</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/examples/project-detail.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Detail</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/contacts.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Contacts</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/faq.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>FAQ</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/contact-us.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Contact us</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-plus-square"></i>
                <p>
                  Extras
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Login & Register v1
                      <i className="fas fa-angle-left right"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <a href="pages/examples/login.html" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Login v1</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/register.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Register v1</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/forgot-password.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Forgot Password v1</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/recover-password.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Recover Password v1</p>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Login & Register v2
                      <i className="fas fa-angle-left right"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <a
                        href="pages/examples/login-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Login v2</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/register-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Register v2</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/forgot-password-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Forgot Password v2</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="pages/examples/recover-password-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Recover Password v2</p>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/lockscreen.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Lockscreen</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/examples/legacy-user-menu.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Legacy User Menu</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="pages/examples/language-menu.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Language Menu</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/404.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Error 404</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/500.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Error 500</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/pace.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Pace</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/examples/blank.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Blank Page</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="starter.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Starter Page</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-search"></i>
                <p>
                  Search
                  <i className="fas fa-angle-left right"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="pages/search/simple.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Simple Search</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="pages/search/enhanced.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Enhanced</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-header">MISCELLANEOUS</li>
            <li className="nav-item">
              <a href="iframe.html" className="nav-link">
                <i className="nav-icon fas fa-ellipsis-h"></i>
                <p>Tabbed IFrame Plugin</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="https://adminlte.io/docs/3.1/" className="nav-link">
                <i className="nav-icon fas fa-file"></i>
                <p>Documentation</p>
              </a>
            </li>
            <li className="nav-header">MULTI LEVEL EXAMPLE</li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-circle nav-icon"></i>
                <p>Level 1</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-circle"></i>
                <p>
                  Level 1<i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Level 2</p>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Level 2<i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <a href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Level 2</p>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-circle nav-icon"></i>
                <p>Level 1</p>
              </a>
            </li>
            <li className="nav-header">LABELS</li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-danger"></i>
                <p className="text">Important</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-warning"></i>
                <p>Warning</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-info"></i>
                <p>Informational</p>
              </a>
            </li> */}
            </ul>
          </nav>
        </div>
      </aside>

      <Modal
        id="modalPackage"
        title="เลือกแพคเกจที่ต้องการ"
        modalSize="modal-lg"
      >
        <div className="row">
          {packages?.length > 0 &&
            packages.map((item, index) => (
              <div className="col-4" key={index}>
                <div className="card">
                  <h5 className="card-header"></h5>
                  <div className="card-body">
                    <h3>{item.name}</h3>
                    <h4 className="mt-3 text-primary">
                      <strong>
                        {parseInt(item.price).toLocaleString('th-TH')} .-
                      </strong>{' '}
                      / เดือน
                    </h4>
                    <div className="mt-3">
                      จำนวนบิล
                      <span className="text-danger mx-2">
                        <strong>
                          {parseInt(item.bill_amount).toLocaleString('th-TH')}
                        </strong>
                      </span>
                      ต่อเดือน
                    </div>
                    <div className="mt-3 text-center">
                      {/* <button className="btn btn-primary btn-lg">
                        <i className="fa fa-check mr-2"></i>
                        เลือกแพคเกจ
                      </button> */}
                      {readerButton(item)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      <Modal id="modalBank" title="ช่องทางชำระเงิน" modalSize="modal-lg">
        <h4 className="text-secondary">
          Package ที่เลือกคือ{' '}
          <span className="text-primary">{choosePackage.name}</span>
        </h4>
        <h5 className="mt-3">
          ราคา{' '}
          <span className="text-danger">
            {parseInt(choosePackage.price).toLocaleString('th-TH')} บาท/เดือน
          </span>
        </h5>
        <table className="mt-3 table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>ธนาคาร</th>
              <th>เลขบัญชี</th>
              <th>เจ้าของบัญชี</th>
              <th>สาขา</th>
            </tr>
          </thead>
          <tbody>
            {banks?.length > 0 &&
              banks.map((item, index) => (
                <tr key={index}>
                  <td>{item.bankType}</td>
                  <td>{item.bankCode}</td>
                  <td>{item.bankName}</td>
                  <td>{item.bankBranch}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="alert mt-3 alert-warning">
          <i className="fa fa-info-circle mr-2"></i>
          เมื่อโอนชำระเงินแล้ว ให้แจ้งที่ไลน์ ID = aikaisys
        </div>

        <div className="mt-3 text-center">
          <button className="btn btn-primary" onClick={handleChangePackage}>
            <i className="fa fa-check mr-2"></i>
            ยืนยันการสมัคร
          </button>
        </div>
      </Modal>
    </>
  );
});
// }

export default Sidebar;
