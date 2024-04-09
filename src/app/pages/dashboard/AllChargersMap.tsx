import React from 'react'

type Props = {
    className: string
  }

const AllChargersMap: React.FC<Props> = ({className}) => {
 return(
    <div className={`card ${className}`}>
      {/* begin::Header */}
     <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>All Orders From</span>

          <span className='text-muted fw-semibold fs-7'>Adjust map to view more</span>
        </h3>
      </div>
      {/* end::Header */}
      <div className='card-body pt-10px'>
      <iframe title='map' 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75991.4167689981!2d75.78732480785469!3d26.892350206560753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db522e8de7303%3A0xa1999bc7158fc2ca!2sZEVpoint%20Charging%20Station!5e0!3m2!1sen!2sin!4v1678899956111!5m2!1sen!2sin" style={{border: 0, width: '100%', height: '450px'}} 
      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div> 
     </div>   
 )

}

export {AllChargersMap}
