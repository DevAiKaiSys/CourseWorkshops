import React, { useEffect, useState } from 'react';
import Template from './Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

function ReportChangePackage() {
  const [members, setMembers] = useState([]);

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
                        <button className="btn btn-success">
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
    </div>
  );
}

export default ReportChangePackage;
