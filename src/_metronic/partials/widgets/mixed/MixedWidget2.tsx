/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../helpers'
import {getCSSVariableValue} from '../../../assets/ts/_utils'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import InventoryIcon from '@mui/icons-material/Inventory';
import EvStationIcon from '@mui/icons-material/EvStation';
import { BASE_URL } from '../../../../app/Config/BaseUrl'
import axios, { AxiosResponse } from 'axios';

import { Button, Switch } from '@mui/material'
import { Base_url } from '../../../../app/Config/BaseUrl';
import { Console } from 'console'

type Props = {
  className: string
  chartColor: string
  strokeColor: string
  chartHeight: string
  
}
interface B2BUser {
  
  id: number;
  name: string;
  registerAs: string;
  
}

interface User {
  

  id: number;
  status: string;
  
  
}
interface Category {
  id: number;
  
}








const MixedWidget2: React.FC<Props> = ({className, chartColor, chartHeight, strokeColor}) => {
  const token = sessionStorage.getItem("token");
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(
      chartRef.current,
      chartOptions(chartHeight, chartColor, strokeColor)
    )
    if (chart) {
      chart.render()
    }

    return chart
  }
 
  const [vendorsData, setVendorsData] = useState<B2BUser[]>([]);
  
  const [usersData, setUsersData] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode])
 


  useEffect(() => {
    const fetchB2BUser = async () => {
      try {
        const response: AxiosResponse<B2BUser[]> = await axios.get(`${Base_url}api/b2b`, {
          headers: { Authorization: `${token}` }
        });
        
        console.log("Response:", response);

        if (response.status === 200) {
          const fetchedB2BUsers: B2BUser[] = response.data;

          // Set all B2B users
          setVendorsData(fetchedB2BUsers);

         
        } else {
          console.error('Error fetching B2B users:', response.statusText);
        }
      } catch (error) {
        console.error('Error:');
      }
    };

    fetchB2BUser();
  }, []);
 
 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response: AxiosResponse<User[]> = await axios.get(`${Base_url}api/users`, {
        headers: { Authorization: `${token}` }
      });

      console.log("user data:", response);


      if (response.status === 200) {
        const fetchedUsers: User[] = response.data;

        // Set all users
        setUsersData(fetchedUsers);

        // Categorize users
        const activeUser: User[] = fetchedUsers.filter((el) => el.status === "active");

        setActiveUser(activeUser);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
   fetchUser();
  }, []); 

  

  useEffect(( ) => {
    const fetchCategory = async () => { 
      try {
        const response: AxiosResponse<Category[]> = await axios.get(`${Base_url}api/category`, {
          headers: { Authorization: `${token}` }
        });
        console.log("category data:", response);

        if (response.status === 200) {
          const fetchedCategories: Category[] = response.data;
          setCategories(fetchedCategories);
        } else {
          console.error('Error fetching categories:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCategory();
  }, []);

 
  
  return (
    <div className="card card-flush h-xl-100" >
    {/*begin::Heading*/}
    <div
      className="card-header rounded bgi-no-repeat bgi-size-cover bgi-position-y-top bgi-position-x-center align-items-start h-250px"
      style={{
        backgroundImage: 'url("https://theodin.in/demos2/ic_dashboard/dist/assets/media/patterns/pattern-1.jpg")'
      }}
      data-bs-theme="light"
    >
      {/*begin::Title*/}
      <h3 className="card-title align-items-start flex-column text-white pt-15">
        <span className="fw-bold fs-2x mb-3"> Summary</span>
        <div className="fs-4 text-white">
          <span className="position-relative d-inline-block">
            <a
              href=""
              className="link-white opacity-75-hover fw-bold d-block mb-1"
            >
              7 New
            </a>
            {/*begin::Separator*/}
            <span className="position-absolute opacity-50 bottom-0 start-0 border-2 border-body border-bottom w-100" />
            {/*end::Separator*/}
          </span>
          <span className="opacity-75"> Users added in last 24 hours</span>
        </div>
      </h3>
      {/*end::Title*/}
      {/*begin::Toolbar*/}
      <div className="card-toolbar pt-5">
        {/*begin::Menu*/}
        <button
          className="btn btn-sm btn-icon btn-active-color-primary btn-color-white bg-white bg-opacity-25 bg-hover-opacity-100 bg-hover-white bg-active-opacity-25 w-20px h-20px"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-overflow="true"
        >
          {/*begin::Svg Icon | path: icons/duotune/general/gen052.svg*/}
          <span className="svg-icon svg-icon-4">
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x={10}
                y={10}
                width={4}
                height={4}
                rx={2}
                fill="currentColor"
              />
              <rect
                x={17}
                y={10}
                width={4}
                height={4}
                rx={2}
                fill="currentColor"
              />
              <rect
                x={3}
                y={10}
                width={4}
                height={4}
                rx={2}
                fill="currentColor"
              />
            </svg>
          </span>
          {/*end::Svg Icon*/}
        </button>
        {/*end::Menu*/}
      </div>
      {/*end::Toolbar*/}
    </div>
    {/*end::Heading*/}
    {/*begin::Body*/}
    <div className="card-body mt-n20">
      {/*begin::Stats*/}
      <div className="mt-n20 position-relative">
        {/*begin::Row*/}
        <div className="row g-3 g-lg-6">
          {/*begin::Col*/}
          <div className="col-6">
            {/*begin::Items*/}
            <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
              {/*begin::Symbol*/}
              <div className="symbol symbol-30px me-5 mb-8">
                <span className="symbol-label">
                  {/*begin::Svg Icon | path: icons/duotune/general/gen020.svg*/}
                  <span className="svg-icon svg-icon-1 svg-icon-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 18V16H10V18L9 20H15L14 18Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.3"
                        d="M20 4H17V3C17 2.4 16.6 2 16 2H8C7.4 2 7 2.4 7 3V4H4C3.4 4 3 4.4 3 5V9C3 11.2 4.8 13 7 13C8.2 14.2 8.8 14.8 10 16H14C15.2 14.8 15.8 14.2 17 13C19.2 13 21 11.2 21 9V5C21 4.4 20.6 4 20 4ZM5 9V6H7V11C5.9 11 5 10.1 5 9ZM19 9C19 10.1 18.1 11 17 11V6H19V9ZM17 21V22H7V21C7 20.4 7.4 20 8 20H16C16.6 20 17 20.4 17 21ZM10 9C9.4 9 9 8.6 9 8V5C9 4.4 9.4 4 10 4C10.6 4 11 4.4 11 5V8C11 8.6 10.6 9 10 9ZM10 13C9.4 13 9 12.6 9 12V11C9 10.4 9.4 10 10 10C10.6 10 11 10.4 11 11V12C11 12.6 10.6 13 10 13Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  {/*end::Svg Icon*/}
                </span>
              </div>
              {/*end::Symbol*/}
              {/*begin::Stats*/}
              <div className="m-0">
                {/*begin::Number*/}
                <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                  { vendorsData !== null && vendorsData.length}
                </span>
                {/*end::Number*/}
                {/*begin::Desc*/}
                <span className="text-gray-500 fw-semibold fs-6">
                  Total Vendors
                </span>
                {/*end::Desc*/}
              </div>
              {/*end::Stats*/}
            </div>
            {/*end::Items*/}
          </div>
          {/*end::Col*/}
          {/*begin::Col*/}
          <div className="col-6">
            {/*begin::Items*/}
            <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
              {/*begin::Symbol*/}
              <div className="symbol symbol-30px me-5 mb-8">
                <span className="symbol-label">
                  {/*begin::Svg Icon | path: icons/duotune/general/gen013.svg*/}
                  <span className="svg-icon svg-icon-1 svg-icon-primary">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M20.9 12.9C20.3 12.9 19.9 12.5 19.9 11.9C19.9 11.3 20.3 10.9 20.9 10.9H21.8C21.3 6.2 17.6 2.4 12.9 2V2.9C12.9 3.5 12.5 3.9 11.9 3.9C11.3 3.9 10.9 3.5 10.9 2.9V2C6.19999 2.5 2.4 6.2 2 10.9H2.89999C3.49999 10.9 3.89999 11.3 3.89999 11.9C3.89999 12.5 3.49999 12.9 2.89999 12.9H2C2.5 17.6 6.19999 21.4 10.9 21.8V20.9C10.9 20.3 11.3 19.9 11.9 19.9C12.5 19.9 12.9 20.3 12.9 20.9V21.8C17.6 21.3 21.4 17.6 21.8 12.9H20.9Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16.9 10.9H13.6C13.4 10.6 13.2 10.4 12.9 10.2V5.90002C12.9 5.30002 12.5 4.90002 11.9 4.90002C11.3 4.90002 10.9 5.30002 10.9 5.90002V10.2C10.6 10.4 10.4 10.6 10.2 10.9H9.89999C9.29999 10.9 8.89999 11.3 8.89999 11.9C8.89999 12.5 9.29999 12.9 9.89999 12.9H10.2C10.4 13.2 10.6 13.4 10.9 13.6V13.9C10.9 14.5 11.3 14.9 11.9 14.9C12.5 14.9 12.9 14.5 12.9 13.9V13.6C13.2 13.4 13.4 13.2 13.6 12.9H16.9C17.5 12.9 17.9 12.5 17.9 11.9C17.9 11.3 17.5 10.9 16.9 10.9Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  {/*end::Svg Icon*/}
                </span>
              </div>
              {/*end::Symbol*/}
              {/*begin::Stats*/}
              <div className="m-0">
                {/*begin::Number*/}
                <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                {categories !== null && categories.length}
                </span>
                {/*end::Number*/}
                {/*begin::Desc*/}
                <span className="text-gray-500 fw-semibold fs-6">
                Total Category
                </span>
                {/*end::Desc*/}
              </div>
              {/*end::Stats*/}
            </div>
            {/*end::Items*/}
          </div>
          

          
          {/*begin::Col*/}
          <div className="col-12">
            {/*begin::Items*/}
            <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
              {/*begin::Symbol*/}
              <div className="symbol symbol-30px me-5 mb-8">
                <span className="symbol-label">
                  {/*begin::Svg Icon | path: icons/duotune/general/gen020.svg*/}
                  <span className="svg-icon svg-icon-1 svg-icon-primary">
                  <InventoryIcon/>
               
                  </span>
                  {/*end::Svg Icon*/}
                </span>
              </div>
              {/*end::Symbol*/}
              {/*begin::Stats*/}
              <div className="m-0">
                {/*begin::Number*/}
                <div className="d-flex justify-content-between">
                <div >
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                  {usersData !== null && usersData.length}
                </span>
                <span className="text-gray-500 fw-semibold fs-6">Total Users</span>
                  </div>

                  <div >
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                  {activeUser !== null && (usersData.length - activeUser.length)}
                  
                </span>
                <span className="text-gray-500 fw-semibold fs-6">Active Users</span>
                  </div>

                  <div>
                    <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                    {activeUser !== null && activeUser.length}
                    </span>
                    <span className="text-gray-500 fw-semibold fs-6">In Active Users</span>
                  </div>
               
                
                
                </div>
                {/*end::Desc*/}
              </div>
              {/*end::Stats*/}
            </div>
            {/*end::Items*/}
          </div>


          <div className="col-12">
            {/*begin::Items*/}
            <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
              {/*begin::Symbol*/}
              <div className="symbol symbol-30px me-5 mb-8">
                <span className="symbol-label">
                  {/*begin::Svg Icon | path: icons/duotune/general/gen020.svg*/}
                  <span className="svg-icon svg-icon-1 svg-icon-primary">
                  <InventoryIcon/>
               
                  </span>
                  {/*end::Svg Icon*/}
                </span>
              </div>
              {/*end::Symbol*/}
              {/*begin::Stats*/}
              <div className="m-0">
                {/*begin::Number*/}
                <div className="d-flex justify-content-between">
                <div >
                  <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                  64,500
                </span>
                <span className="text-gray-500 fw-semibold fs-6">Total Revenue</span>
                  </div>

                  
               
                
                
                </div>
                {/*end::Desc*/}
              </div>
              {/*end::Stats*/}
            </div>
            {/*end::Items*/}
          </div>

        </div>
        {/*end::Row*/}
      </div>
      {/*end::Stats*/}
    </div>
    {/*end::Body*/}
  </div>
  )
}

const chartOptions = (
  chartHeight: string,
  chartColor: string,
  strokeColor: string
): ApexOptions => {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const color = getCSSVariableValue('--kt-' + chartColor)

  return {
    series: [
      {
        name: 'Net Profit',
        data: [30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '$' + val + ' thousands'
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ['transparent'],
    markers: {
      colors: [color],
      strokeColors: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export {MixedWidget2}
