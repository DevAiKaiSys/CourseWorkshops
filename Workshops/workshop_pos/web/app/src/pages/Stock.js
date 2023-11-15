import React from 'react';
import Template from '../components/Template';

function Stock() {
  return (
    <div>
      <Template>
        <div className="card">
          <h5 className="card-header">รับสินค้าเข้า stock</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text">สินค้า</label>
                  </div>
                  <input type="text" className="form-control" />
                  <button className="btn btn-primary">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text">จำนวน</label>
                  </div>
                  <input type="number" className="form-control" />
                </div>
              </div>
              <div className="col-7">
                <button className="btn btn-primary">
                  <i className="fa fa-check mr-2"></i>
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </div>
  );
}

export default Stock;
