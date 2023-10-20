import React from 'react';

function Modal(props) {
  return (
    // Bootstrap 5 Live demo
    // <div
    //   className="modal fade"
    //   id={props.id}
    //   tabIndex="-1"
    //   aria-labelledby="exampleModalLabel"
    //   aria-hidden="true"
    // >
    //   <div className="modal-dialog">
    //     <div className="modal-content">
    //       <div className="modal-header">
    //         <h1 className="modal-title fs-5" id="exampleModalLabel">
    //           {props.title}
    //         </h1>
    //         <button
    //           id="btnModalClose"
    //           type="button"
    //           className="btn-close"
    //           data-bs-dismiss="modal"
    //           aria-label="Close"
    //         ></button>
    //       </div>
    //       <div className="modal-body">{props.children}</div>
    //     </div>
    //   </div>
    // </div>

    // Bootstrap 5 Static backdrop
    // <div
    //   className="modal fade"
    //   id={props.id}
    //   data-bs-backdrop="static"
    //   data-bs-keyboard="false"
    //   tabIndex="-1"
    //   aria-labelledby="staticBackdropLabel"
    //   aria-hidden="true"
    // >
    //   <div className="modal-dialog">
    //     <div className="modal-content">
    //       <div className="modal-header">
    //         <h1 className="modal-title fs-5" id="staticBackdropLabel">
    //           {props.title}
    //         </h1>
    //         <button
    //           id="btnModalClose"
    //           type="button"
    //           className="btn-close"
    //           data-bs-dismiss="modal"
    //           aria-label="Close"
    //         ></button>
    //       </div>
    //       <div className="modal-body">{props.children}</div>
    //     </div>
    //   </div>
    // </div>

    // Bootstrap 4 Static backdrop
    <div
      className="modal fade"
      id={props.id}
      data-backdrop="static"
      data-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog${
          props.modalSize ? ` ${props.modalSize}` : ''
        }`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              {props.title}
            </h5>
            <button
              id="btnModalClose"
              type="button"
              className="close btnModalClose"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
