import React, { useEffect, useState } from 'react';
import Template from './Template';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';
import Modal from '../components/Modal';

function ReportSumSalePerYear() {
  const [results, setResults] = useState([]);
  const [selectedํResult, setSelectedResult] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(
          `${config.api_path}/changePackage/reportSumSalePerYear`,
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
          <h5 className="card-header">รายงานสรุปยอดขายรายปี</h5>
          <div className="card-body">
            {/* <div className="input-group">
              <span className="input-group-text">ปี</span>
              <select
                name=""
                id=""
                className="form-control"
              >
                {years.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={fetchData}>
                <i className="fa fa-check me-2"></i>แสดงรายการ
              </button>
            </div> */}

            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th width="200px">ปี</th>
                  <th className="text-end">รายได้</th>
                  <th width="200px"></th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 &&
                  results.map((item, index) => (
                    <tr key={index}>
                      <td>{item.year}</td>
                      <td className="text-end">
                        {parseInt(item.sum).toLocaleString('th-TH')}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#modalInfo"
                          onClick={() => setSelectedResult(item.results)}
                        >
                          <i className="fa fa-file-alt me-2"></i>ดูรายการ
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalInfo" title="แสดงรายการ" modalSize="modal-lg">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>วันที่สมัคร</th>
              <th>วันที่ชำระเงิน</th>
              <th>ผู้สมัคร</th>
              <th>package</th>
              <th>ค่าบริการรายเดือน</th>
            </tr>
          </thead>
          <tbody>
            {selectedํResult?.length > 0 &&
              selectedํResult.map((item, index) => (
                <tr key={index}>
                  <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td>
                    {dayjs(item.payDate).format('DD/MM/YYYY')} {item.payHour}:
                    {item.payMinute}
                  </td>
                  <td>{item.member.name}</td>
                  <td>{item.package.name}</td>
                  <td className="text-end">
                    {parseInt(item.package.price).toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
}

export default ReportSumSalePerYear;
