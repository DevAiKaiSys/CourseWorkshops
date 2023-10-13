import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';

function Package() {
  const [packages, setPackages] = useState([]);
  const [yourPackage, setYourPackage] = useState({});
  const [name, setName] = useState();
  const [phone, setPhone] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      axios
        .get(config.api_path + '/package/list')
        .then((res) => {
          setPackages(res.data.results);
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const choosePackage = (item) => {
    setYourPackage(item);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: 'ยืนยันการสมัคร',
        text: 'โปรดยืนยันการสมัครใช้บริการ package ของเรา',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          const payload = {
            packageId: yourPackage.id,
            name: name,
            phone: phone,
          };
          axios
            .post(config.api_path + '/package/memberRegister', payload)
            .then((res) => {
              if (res.data.message === 'success') {
                Swal.fire({
                  title: 'บันทึกข้อมูล',
                  text: 'บันทึกข้อมูลการสมัครแล้ว',
                  icon: 'success',
                  timer: 2000,
                });
                document.getElementById('btnModalClose').click();
              }
            });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="container mt-2">
        <div className="h2 text-secondary">KobPOS : Point of Sale on Cloud</div>
        <div className="h5">Package for You</div>
        <div className="row">
          {packages.map((item, index) => (
            <div className="col-4" key={index}>
              {/* <div>name</div>
              <div>bill per month</div>
              <div>price</div>
              <div className="mt-3">
                <button className="btn btn-primary">สมัคร</button>
              </div> */}
              <div className="card">
                <div className="card-body text-center">
                  <div className="h4 text-success">{item.name}</div>
                  <div className="h5">
                    {parseInt(item.bill_amount).toLocaleString('th-TH')} &nbsp;
                    บิลต่อเดือน
                  </div>
                  <div className="h5 text-secodary">
                    {parseInt(item.price).toLocaleString('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                    })}
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalRegister"
                      onClick={(e) => choosePackage(item)}
                    >
                      สมัคร
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal id="modalRegister" title="สมัครใช้บริการ">
        <form onSubmit={handleRegister}>
          <div>
            {/* <label>package</label> */}
            <div className="alert alert-info">
              {yourPackage.name} ราคา {yourPackage.price} ต่อเดือน
            </div>
          </div>
          <div className="mt-3">
            <label>ชื่อร้าน</label>
            <input
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label>เบอร์โทร</label>
            <input
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-primary">
              ยืนยันการสมัคร <i className="fa fa-arrow-right ms-2"></i>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Package;
