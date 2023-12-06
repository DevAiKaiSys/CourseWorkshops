import React, { useState } from 'react';
import Template from './Template';
import Modal from '../components/Modal';

function Admin() {
  const [level, setLevel] = useState(['admin', 'sub admin']);
  const [selectedLevel, setSelectedLevel] = useState('admin');

  return (
    <>
      <Template>
        <div className="card">
          <h5 className="card-header">ผู้ใช้ระบบ</h5>
          <div className="card-body">
            <butoon
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalForm"
            >
              <i className="fa fa-plus me-2"></i>เพิ่มรายการ
            </butoon>

            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>user</th>
                  <th>ระดับ</th>
                  <th>email</th>
                  <th width="180px"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalForm" title="ข้อมูล admin" modalSzie="modal-lg">
        <div>
          <label>ชื่อ</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mt=3">
          <label>username</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mt=3">
          <label>password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="mt=3">
          <label>confirm password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="mt=3">
          <label>ระดับ</label>
          <select
            name=""
            id=""
            className="form-control"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {level.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="mt=3">
          <label>email</label>
          <input type="text" className="form-control" />
        </div>
        <div className="my-3">
          <button className="btn btn-primary">
            <i className="fa fa-check me-2"></i>บันทึก
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Admin;
