import React, { useState } from 'react';
import axios from 'axios';
import config from './config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function App() {
  const [usr, setUsr] = useState('');
  const [pwd, setPwd] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        usr: usr,
        pwd: pwd,
      };
      await axios
        .post(config.api_path + '/admin/signin', payload)
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
          }
        });
      // .catch((err) => {
      //   throw err.response;
      // });
    } catch (error) {
      if (error.response.status == 401) {
        Swal.fire({
          title: 'Sign In',
          text: 'username หรือ password ไม่ถูกต้อง',
          icon: 'error',
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: 'error',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="container m-5">
      <div className="card">
        <h5 className="card-header">Sign in to BackOffice</h5>
        <div className="card-body">
          <div className="row mb-3">
            <label for="inputEmail3" className="col-sm-2 col-form-label">
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                id="inputEmail3"
                onChange={(e) => setUsr(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label for="inputPassword3" className="col-sm-2 col-form-label">
              Password
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className="form-control"
                id="inputPassword3"
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
