import React, { useEffect, useState } from 'react';
import Template from './Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import Modal from '../components/modal';

function ReportChangePackage() {
  const [members, setMembers] = useState([]);
  const [hour, setHour] = useState(() => {
    let arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push(i);
    }
    return arr;
  });
  const [minute, setMinute] = useState(() => {
    let arr = [];
    for (let i = 0; i < 60; i++) {
      arr.push(i);
    }
    return arr;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/changePackage/list`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setMembers(res.data.results);
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

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">รายงานคนที่ขอเปลี่ยน แพคเกจ</h5>
          <div className="card-body">
            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เบอร์โทร</th>
                  <th>วันที่ขอเปลี่ยน</th>
                  <th>แพคเกจที่ต้องการ</th>
                  <th>ค่าบริการต่อเดือน</th>
                  <th width="180px"></th>
                </tr>
              </thead>
              <tbody>
                {members?.length > 0 &&
                  members.map((item, index) => (
                    <tr key={index}>
                      <td>{item.member.name}</td>
                      <td>{item.member.phone}</td>
                      <td>
                        {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </td>
                      <td>{item.package.name}</td>
                      <td>{item.package.price}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPay"
                        >
                          <i className="fa fa-check me-2"></i>ได้รับเงินแล้ว
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalPay" title="">
        <div>
          <label>วันที่ชำระเงิน</label>
          <input type="date" className="form-control" />
        </div>
        <div className="mt-3">
          <label>เวลา่</label>
          <div className="row">
            <div className="col-6">
              <div className="input-group">
                <div className="input-group-text">ชั่วโมง</div>
                <select name="" id="" className="form-control">
                  {hour.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="input-group">
                <div className="input-group-text">นาที</div>
                <select name="" id="" className="form-control">
                  {minute.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label>หมายเหตุ</label>
          <input type="text" className="form-control" />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary">
            <i className="fa fa-check me-2"></i>บันทึก
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ReportChangePackage;
