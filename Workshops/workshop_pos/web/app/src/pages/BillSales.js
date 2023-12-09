import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import Modal from '../components/Modal';

function BillSales() {
  const [billSales, setBillSales] = useState([]);
  const [selectBill, setSelectBill] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/billSale/list`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setBillSales(res.data.results);
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
          <h5 className="card-header">รายงานบิลขาย</h5>
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th width="180px"></th>
                  <th width="100px">เลขบิล</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {billSales?.length > 0 &&
                  billSales.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectBill(item)}
                          data-toggle="modal"
                          data-target="#modalBillSaleDetail"
                        >
                          <i className="fa fa-file alt mr-2"></i>รายการบิลขาย
                        </button>
                      </td>
                      <td>{item.id}</td>
                      <td>{item.createdAt}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalBillSaleDetail" title="รายการในบิล" modalSize="modal-lg">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>รายการ</th>
              <th className="text-right">ราคา</th>
              <th className="text-right">จำนวน</th>
              <th className="text-right">ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {selectBill?.billSaleDetails &&
              selectBill.billSaleDetails.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td className="text-right">
                    {parseInt(item.price).toLocaleString('th-TH')}
                  </td>
                  <td className="text-right">{item.qty}</td>
                  <td className="text-right">
                    {parseInt(item.price * item.qty).toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default BillSales;
