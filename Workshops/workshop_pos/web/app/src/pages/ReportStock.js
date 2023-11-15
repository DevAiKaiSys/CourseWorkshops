import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';

function ReportStock() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchDate();
  }, []);

  const fetchDate = async () => {
    try {
      await axios
        .get(`${config.api_path}/stock/report`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setStocks(res.data.results);
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
        timer: 2000,
      });
    }
  };

  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">รายงาน Stock</h5>
          <div className="card-body">
            <table className="table table-bordered table-triped mt-3">
              <thead>
                <tr>
                  <th>barcode</th>
                  <th>รายการ</th>
                  <th>รับเข้า</th>
                  <th>ขายออก</th>
                  <th>คงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {stocks?.length > 0 &&
                  stocks.map((item, index) => (
                    <tr key={index}>
                      <td>{item.result.barcode}</td>
                      <td>{item.result.name}</td>
                      <td className="text-right">
                        <a href="" className="btn btn-link text-success">
                          {parseInt(item.stockIn).toLocaleString('th-TH')}
                        </a>
                      </td>
                      <td className="text-right">
                        <a href="" className="btn btn-link text-danger">
                          {parseInt(item.stockOut).toLocaleString('th-TH')}
                        </a>
                      </td>
                      <td className="text-right">
                        {(item.stockIn - item.stockOut).toLocaleString('th-TH')}
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

export default ReportStock;
