function App() {
  return (
    <div className="container m-5">
      <div className="card">
        <h5 className="card-header">Sign in to BackOffice</h5>
        <div className="card-body">
          <div className="row mb-3">
            <label for="inputEmail3" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="inputEmail3" />
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
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
