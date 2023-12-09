import React, { useEffect, useState } from 'react';
import Template from '../components/Template';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import config from '../config';
import axios from 'axios';
import Swal from 'sweetalert2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      data: labels.map(() => getRandomNumber(0, 1000)),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    // {
    //   label: 'Dataset 2',
    //   // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
    //   data: labels.map(() => getRandomNumber(0, 1000)),
    //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
    // },
  ],
};

function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [arrYear, setArrYear] = useState(() => {
    let arr = [];
    const y = new Date().getFullYear();
    const startYear = y - 5;

    for (let i = startYear; i <= y; i++) {
      arr.push(i);
    }
    return arr;
  });
  const [myData, setMyData] = useState([]);
  const [options, setOptions] = useState(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const payload = {
        year: year,
      };
      await axios
        .post(
          `${config.api_path}/changePackage/reportSumSalePerMonth`,
          payload,
          config.headers()
        )
        .then((res) => {
          if (res.status === 200) {
            const results = res.data.results;
            let arr = [];

            for (let i = 0; i < results.length; i++) {
              const item = results[i];
              arr.push(item.sum);
            }

            const labels = [
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
            ];

            setMyData({
              labels,
              datasets: [
                {
                  label: 'ยอดขาย',
                  data: arr,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
              ],
            });
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
        <div className="container">
          <h5>Dashboard</h5>
          <div className="row mt-2">
            <div className="col-4">
              <div className="input-group">
                <div className="input-group-text">ปี</div>
                <select
                  name=""
                  id=""
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {arrYear?.length > 0 &&
                    arrYear.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-4">
              <button className="btn btn-primary" onClick={fetchData}>
                <i className="fa fa-check me-2"></i>แสดงรายการ
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
            <h5>รายงานสรุปยอดขายรายเดือน ปี {year}</h5>
          </div>
          <div className="mt-3">
            {myData.datasets && <Bar options={options} data={myData} />}
          </div>
        </div>
      </Template>
    </div>
  );
}

export default Home;
