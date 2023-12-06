import React, { useEffect, useState } from 'react';
import Template from './Template';
import Modal from '../components/Modal';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';

function Admin() {
  const [level, setLevel] = useState(['admin', 'sub admin']);
  const [selectedLevel, setSelectedLevel] = useState('admin');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [admins, setAdmins] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(`${config.api_path}/admin/list`, config.headers())
        .then((res) => {
          if (res.status === 200) {
            setAdmins(res.data.results);
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

  const handleSave = async () => {
    if (password != confirmPassword) {
      Swal.fire({
        title: 'ตรวจสอบข้อมูล',
        text: 'password กับการยืนยันไม่ตรงกัน',
        icon: 'error',
      });
    } else {
      try {
        const payload = {
          name: name,
          usr: user,
          level: selectedLevel,
          email: email,
        };
        if (password != '') {
          payload.pwd = password;
        }

        let url = '/admin/create';
        if (id > 0) {
          url = '/admin/edit/' + id;
        }

        await axios
          .post(`${config.api_path}${url}`, payload, config.headers())
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                title: 'บันทึกข้อมูล',
                text: 'บันทึกข้อมูลแล้ว',
                icon: 'success',
                timer: 2000,
              });

              setName('');
              setUser('');
              setPassword('');
              setConfirmPassword('');
              setSelectedLevel('');
              setEmail('');
              setId(0);

              handleCloseModal();
              fetchData();
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
    }
  };

  const handleCloseModal = () => {
    const modalElements = document.querySelectorAll('.modal.show');

    modalElements.forEach((element) => {
      const elementsWithIdClose = element.querySelectorAll('#btnModalClose');

      // Step 3: Loop through all elements and child elements with id="btnModalClose"
      elementsWithIdClose.forEach((element) => {
        element.click();
      });
    });
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: 'ลบข้อมูล',
      text: 'ยืนยันการลบ',
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .delete(
              `${config.api_path}/admin/delete/${item.id}`,
              config.headers()
            )
            .then((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: 'ลบข้อมูล',
                  text: 'ลบข้อมูลแล้ว',
                  icon: 'success',
                  timer: 1000,
                });
                fetchData();
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
      }
    });
  };

  const handleSelectedAdmin = (item) => {
    setSelectedLevel(item.level);
    setName(item.name);
    setUser(item.usr);
    setEmail(item.email);
    setId(item.id);
  };

  return (
    <>
      <Template>
        <div className="card">
          <h5 className="card-header">ผู้ใช้ระบบ</h5>
          <div className="card-body">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalForm"
            >
              <i className="fa fa-plus me-2"></i>เพิ่มรายการ
            </button>

            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>user</th>
                  <th>ระดับ</th>
                  <th>email</th>
                  <th width="140px"></th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 &&
                  admins.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.usr}</td>
                      <td>{item.level}</td>
                      <td>{item.email}</td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleSelectedAdmin(item)}
                          data-bs-toggle="modal"
                          data-bs-target="#modalForm"
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalForm" title="ข้อมูล admin" modalSzie="modal-lg">
        <div>
          <label>ชื่อ</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt=3">
          <label>username</label>
          <input
            type="text"
            className="form-control"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="mt=3">
          <label>password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt=3">
          <label>confirm password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mt=3">
          <label>ระดับ</label>
          <select
            name=""
            id=""
            className="form-control"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {level.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt=3">
          <label>email</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-3">
          <button className="btn btn-primary" onClick={handleSave}>
            <i className="fa fa-check me-2"></i>บันทึก
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Admin;
