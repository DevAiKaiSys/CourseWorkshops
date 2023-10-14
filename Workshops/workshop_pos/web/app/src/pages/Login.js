import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import config from '../config';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [phone, setPhone] = useState();
  const [pass, setPass] = useState();

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const payload = {
        phone: phone,
        pass: pass,
      };
      await axios
        .post(config.api_path + '/member/signin', payload)
        .then((res) => {
          if (res.data.message === 'success') {
            Swal.fire({
              title: 'Sign In',
              text: 'เข้าสู่ระบบแล้ว',
              icon: 'success',
              timer: 2000,
            });

            localStorage.setItem(config.token_name, res.data.token);
            navigate('/home');
          } else {
            Swal.fire({
              title: 'Sign In',
              text: 'ไม่พบข้อมูลในระบบ',
              icon: 'warning',
              timer: 2000,
            });
          }
        });
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  return (
    <div>
      <div className="card container mt-5" style={{ padding: '0px' }}>
        <h5 className="card-header">Login to POS</h5>
        <div className="card-body">
          {/* <h5 class="card-title">Login to POS</h5> */}
          <div>
            <label>เบอร์โทร</label>
            <input
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="my-3">
            <button className="btn btn-primary" onClick={handleSignIn}>
              <i className="fa fa-check me-2"></i>Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
