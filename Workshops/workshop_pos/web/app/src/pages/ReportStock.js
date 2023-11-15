import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import Modal from '../components/Modal';
import dayjs from 'dayjs';

function ReportStock() {
  const [stocks, setStocks] = useState([]);
  const [currentStock, setCurrentStock] = useState({});

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
                        <a
                          href=""
                          className="btn btn-link text-success"
                          onClick={() => {
                            // setCurrentStock(item.result.stocks);
                            setCurrentStock(item.result);
                            // console.log(item);
                          }}
                          data-toggle="modal"
                          data-target="#modalStockIn"
                        >
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

      <Modal
        id="modalStockIn"
        title="ข้อมูลการรับเข้าสต๊อก"
        modalSize="modal-lg"
      >
        <table className="table table-bordered table-triped mt-3">
          <thead>
            <tr>
              <th width="150px">barcode</th>
              <th>รายการ</th>
              <th width="100px" className="text-right">
                จำนวน
              </th>
              <th width="180px">วันที่</th>
              {/* <th width="100px"></th> */}
            </tr>
          </thead>
          <tbody>
            {currentStock?.stocks?.length > 0 &&
              currentStock.stocks.map((item, index) => (
                <tr key={index}>
                  <td>{currentStock.barcode}</td>
                  <td>{currentStock.name}</td>
                  <td className="text-right">{item.qty}</td>
                  <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                  {/* <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item)}
                    >
                      <i className="fa fa-times mr-2"></i>ลบ
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default ReportStock;
