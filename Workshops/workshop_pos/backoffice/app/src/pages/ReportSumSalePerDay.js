import React, { useState } from 'react';
import Template from './Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';

function ReportSumSalePerDay() {
  const [years, setYears] = useState(() => {
    let arr = [];
    let d = new Date();
    let currentYear = d.getFullYear();
    let lastYear = currentYear - 5;

    for (let i = lastYear; i <= currentYear; i++) {
      arr.push(i);
    }

    return arr;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear();
  });
  const [months, setMonths] = useState([
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().getMonth() + 1;
  });
  const [results, setResults] = useState([]);

  const handleShowReport = async () => {
    try {
      const payload = {
        month: selectedMonth,
        year: selectedYear,
      };
      await axios
        .post(
          `${config.api_path}/changePackage/reportSumSalePerDay`,
          payload,
          config.headers()
        )
        .then((res) => {
          if (res.status === 200) {
            setResults(res.data.results);
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
    <>
      <Template>
        <div className="card">
          <h5 className="card-header">รายงานคนที่ขอเปลี่ยน แพคเกจ</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <div className="input-group">
                  <span className="input-group-text">ปี</span>
                  <select
                    name=""
                    id=""
                    className="form-control"
                    value={selectedYear}
                  >
                    {years.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <span className="input-group-text">เดือน</span>
                  <select
                    name=""
                    id=""
                    className="form-control"
                    value={selectedMonth}
                  >
                    {months.map((item, index) => (
                      <option value={index + 1} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-8">
                <button className="btn btn-primary" onClick={handleShowReport}>
                  <i className="fa fa-check me-2"></i>แสดงรายการ
                </button>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </>
  );
}

export default ReportSumSalePerDay;
