/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'

import {useIntl} from 'react-intl'
// import PieChart from 'react-pie-graph-chart';
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  MixedWidget2,
  ChartsWidget3,
  ChartsWidget6
} from '../../../_metronic/partials/widgets'
import { ChartsWidget170 } from './ChartsWidget170'
import { AllChargersMap } from './AllChargersMap'
import { PieWidgetDashboard } from './PieWidgetDashboard'
import { BASE_URL } from '../../Config/BaseUrl'
import axios from 'axios'

const DashboardPage = ({users}) => (
  
  <>

    {/* begin::Row */}
    <div className='row g-5 g-xl-10'>
      {/* begin::Col */}
      <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-md-5 ' >
       
        <MixedWidget2
            className='card-xl-stretch mb-xl-8 '
            chartColor='info'
            chartHeight='100px'
            strokeColor='#4e12c4'
          />
          
        
      </div>
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 ' >
        {/* mb-md-5 mb-xl-10 */}
      <CardsWidget20
          className=' mb-5'
          description='Total Customer Tickets'
          color='#1B9A8B'
          img={'https://theodin.in/demos2/ic_dashboard/dist/assets/media/patterns/vector-12.png'}
          percent="72"
          heading="20"
          pending="Resolved"
        />
       
         <CardsWidget7
          className=' '
          description='Total consumer'
          color='#1B9A8B'
          icon={false}
          stats={"1812"}
          labelColor='dark'
          textColor='gray-300'
          />
      
      </div>

     
      <div className='col-md-12 col-lg-12 col-xl-12 col-xxl-3 ' >
        <div className="row">
        <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-12 mb-md-5  '>
        
        <CardsWidget17 className=' '/>
        </div>

        <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-12 mb-md-5  ' >
         <ChartsWidget170 className=' '/>
        </div>
        </div>    
      </div>

	  
    </div>
    {/* end::Row */}

   


   

    {/* begin::Row */}
    <div className='row gy-5 gx-xl-8' style={{marginTop:"20px"}}>
      <div className='col-md-6'>
        <ChartsWidget3 className='card-xl-stretch mb-xl-8'/>
      </div>
      <div className='col-md-6'>
        <PieWidgetDashboard className='card-xl-stretch mb-xl-8'/>
      </div>
    </div>

    <div className='row gy-5 gx-xl-8' style={{marginTop:"20px"}}>
      <div className='col-md-12'>
       <ChartsWidget6 className='card-xl-stretch mb-xl-8'/>
      </div>
    </div>

	<div className='row gy-5 g-xl-8' style={{marginTop:"20px"}}>
	  <div className='col-md-12 col-lg-12 col-xl-12 col-xxl-12'>
	     <AllChargersMap className='card-xl-stretch mb-xl-8'/>
	   </div>	
	</div>	
   
	 

   
  
  
    
  </>
)

const DashboardWrapper = () => {
  const intl = useIntl()
  const token =sessionStorage.getItem('token');
  const [usersrows, setUsersRows] = useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/customers/customers
        `, {
          headers: { Authorization: `${token}` },
        });
        // Assuming the response data is an array of objects with the required properties
        
        const data = response.data;
        const CustomersData=data.data.users;
        console.log("response chargers==>", CustomersData);
        if(data && data.status === 'success'){
          
  
          setUsersRows(CustomersData);
        }
        else{
          setUsersRows([]);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsersRows([]);
      }
    };
  
    
    fetchData();
  },[])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage  users={usersrows}/>
    </>
  )
}

export {DashboardWrapper}
