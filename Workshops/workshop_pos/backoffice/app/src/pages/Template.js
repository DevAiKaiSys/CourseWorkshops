import React from 'react';
import { Link } from 'react-router-dom';

function Template(props) {
  return (
    <div>
      <div className="row">
        <div className="col-xxl-2 col-xl-3 bg-dark vh-100 px-4 pt-2">
          <div className="text-white">
            <div>xxxx : Admin</div>
            <div className="mt-3">
              <button className="btn btn-outline-warning btn-lg">
                Sign Out
              </button>
            </div>
          </div>
          <div className="d-grid gap-3 mt-5">
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              รายงานคนที่สมัครใช้บริการ
            </Link>
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              รายงานคนที่ขอเปลี่ยน แพคเกจ
            </Link>
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              รายงานรายได้รายวัน
            </Link>
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              รายงานรายได้รายเดือน
            </Link>
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              รายงานรายได้รายปี
            </Link>
            <Link to="/" className="btn btn-outline-info btn-lg text-start">
              ผู้ใช้ระบบ
            </Link>
          </div>
        </div>
        <div className="col-xxl-10 col-xl-9">{props.children}</div>
      </div>
    </div>
  );
}

export default Template;
