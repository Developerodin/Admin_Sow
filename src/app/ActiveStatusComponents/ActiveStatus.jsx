import React from 'react'

const ActiveStatus = (props) => {
    const{status}=props;
  return (
    <div>
    {status ==="true" &&  <div className='badge badge-light-success fw-bolder'>Enabled</div>}
   {status ==="false" &&  <div className='badge badge-light-danger fw-bolder' style={{color:"red"}}>Disabel</div>}
    {/* <div className='badge badge-light-success fw-bolder' style={{color:"red"}}>Disabel</div> */}
    </div>
  )}

export default ActiveStatus
