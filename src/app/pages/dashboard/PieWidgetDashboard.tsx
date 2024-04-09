import React from "react";
import { PieChart } from 'react-minimal-pie-chart';

type Props = {
    className: string
  }

const dataMock = [
    { title: 'Scrap Seller', value: 40, color: '#F1F1F1' },
   
    { title: 'Scrap Buyer', value: 60, color: '#DCE2C8' },
    
  ];

  const dataMock2 = [
    { title: 'Category 1', value: 30, color: '#FFC700' },
    { title: 'Category 4', value: 20, color: '#7239EA' },
    { title: 'Category 2', value: 10, color: '#1B9A8B'  },
    { title: 'Category 5', value: 40, color: '#D83F31'  },
  ];
  
const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };
  
const PieWidgetDashboard: React.FC<Props> = ({className}) =>{
      
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Users & Transactions Share</span>

          <span className='text-muted fw-semibold fs-7'> user and revenue pie chart</span>
        </h3>
        </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body'>  
      <div className="row justify-content-around" >
        <div className="col-sm-4 " >
          <p style={{fontWeight:"bold"}}>User Market Share</p>
          <div >
          <div>
          <PieChart
            data={dataMock}
            label={({ dataEntry }) => dataEntry.value}
            labelStyle={{
              
              fontSize: '7px',
            
            
              
              
            }}
            
            lineWidth={90}
          />
          </div>

          <div style={{width:"90%",display:"flex",flexWrap:"wrap",marginTop:"5px"}}>
              {dataMock.map((el)=>{
                return(
                  <div style={{margin:"5px"}}> <span style={{margin:"2px",borderRadius:"100px", backgroundColor:`${el.color}`,color:`${el.color}`}}>OO</span>{el.title}</div>
                )
              })}
          </div>
          </div>
         
            
        </div>
        <div className="col-sm-4">
          <p style={{fontWeight:"bold"}}>Revenue Market Share</p>
          <div>
          <PieChart
            data={dataMock2}
            label={({ dataEntry }) => dataEntry.value}
            labelStyle={{
              color:"#fff",
              fontSize: '7px',
            }}
            
            lineWidth={90}
          />
          </div>

          <div style={{width:"90%",display:"flex",flexWrap:"wrap",marginTop:"5px"}}>
              {dataMock2.map((el)=>{
                return(
                  <div style={{margin:"5px"}}> <span style={{margin:"2px",borderRadius:"100px", backgroundColor:`${el.color}`,color:`${el.color}`}}>OO</span>{el.title}</div>
                )
              })}
          </div>
        </div>
      </div>
      
      </div>
    </div>
      );
}  

export {PieWidgetDashboard}