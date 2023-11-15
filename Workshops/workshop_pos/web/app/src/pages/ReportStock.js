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
          <div className="card-body"></div>
        </div>
      </Template>
    </div>
  );
}

export default ReportStock;
