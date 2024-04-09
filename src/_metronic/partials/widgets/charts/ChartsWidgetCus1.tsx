/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import ReactApexChart from 'react-apexcharts'


type Props = {
  className: string
}

const ChartsWidgetCus1: React.FC<Props> = ({className}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
 
  

  const refreshMode = () => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshMode()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
            <h3 className="card-title align-items-start flex-column">
              <span
                className="card-label fw-bold text-dark"
                style={{ textTransform: "capitalize" }}
              >
              
                Vechicle Type v/s Revenue graph
              </span>
              <span className="text-gray-400 mt-1 fw-semibold fs-6">
                Users from all channels
              </span>
            </h3>
              {/*begin::Toolbar*/}
  <div className="card-toolbar">
    <ul className="nav" id="kt_chart_widget_8_tabs">
      <li className="nav-item">
        <a
          className="nav-link btn btn-sm btn-color-muted btn-active btn-active-light fw-bold px-4 me-1"
          data-bs-toggle="tab"
          id="kt_chart_widget_8_week_toggle"
          href="#kt_chart_widget_8_week_tab"
        >
          Month
        </a>
      </li>
      <li className="nav-item">
        <a
          className="nav-link btn btn-sm btn-color-muted btn-active btn-active-light fw-bold px-4 me-1 active"
          data-bs-toggle="tab"
          id="kt_chart_widget_8_month_toggle"
          href="#kt_chart_widget_8_month_tab"
        >
          Week
        </a>
      </li>
    </ul>
  </div>
  {/*end::Toolbar*/}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
      <>
  <div className="mb-5">
    {/*begin::Statistics*/}
    <div className="d-flex align-items-center mb-2">
      <span className="fs-1 fw-semibold text-gray-400 me-1 mt-n1">₹</span>
      <span className="fs-3x fw-bold text-gray-800 me-2 lh-1 ls-n2">18,89</span>
      <span className="badge badge-light-success fs-base">
        {/*begin::Svg Icon | path: icons/duotune/arrows/arr066.svg*/}
        <span className="svg-icon svg-icon-5 svg-icon-success ms-n1">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.5"
              x={13}
              y={6}
              width={13}
              height={2}
              rx={1}
              transform="rotate(90 13 6)"
              fill="currentColor"
            />
            <path
              d="M12.5657 8.56569L16.75 12.75C17.1642 13.1642 17.8358 13.1642 18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711L5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75C6.16421 13.1642 6.83579 13.1642 7.25 12.75L11.4343 8.56569C11.7467 8.25327 12.2533 8.25327 12.5657 8.56569Z"
              fill="currentColor"
            />
          </svg>
        </span>
        {/*end::Svg Icon*/}4,8%
      </span>
    </div>
    {/*end::Statistics*/}
    {/*begin::Description*/}
    <span className="fs-6 fw-semibold text-gray-400">
      Avarage cost per interaction
    </span>
    {/*end::Description*/}
  </div>
  {/*end::Statistics*/}
  {/*begin::Chart*/}
  <div
    id="kt_chart_widget_8_week_chart"
    className="ms-n5 min-h-auto">

  </div>    
  {/*end::Chart*/}
  {/*begin::Items*/}
  <div className="d-flex flex-wrap pt-5">
    {/*begin::Item*/}
    <div className="d-flex flex-column me-7 me-lg-16 pt-sm-3 pt-6">
      {/*begin::Item*/}
      <div className="d-flex align-items-center mb-3 mb-sm-6">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-primary me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-gray-600 fs-6">Social Campaigns</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
      {/*begin::Item*/}
      <div className="d-flex align-items-center">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-danger me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-<gray-600 fs-6">Google Ads</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
    </div>
    {/*ed::Item*/}
    {/*begin::Item*/}
    <div className="d-flex flex-column me-7 me-lg-16 pt-sm-3 pt-6">
      {/*begin::Item*/}
      <div className="d-flex align-items-center mb-3 mb-sm-6">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-success me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-gray-600 fs-6">Email Newsletter</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
      {/*begin::Item*/}
      <div className="d-flex align-items-center">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-warning me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-gray-600 fs-6">Courses</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
    </div>
    {/*ed::Item*/}
    {/*begin::Item*/}
    <div className="d-flex flex-column pt-sm-3 pt-6">
      {/*begin::Item*/}
      <div className="d-flex align-items-center mb-3 mb-sm-6">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-info me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-gray-600 fs-6">TV Campaign</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
      {/*begin::Item*/}
      <div className="d-flex align-items-center">
        {/*begin::Bullet*/}
        <span className="bullet bullet-dot bg-success me-2 h-10px w-10px" />
        {/*end::Bullet*/}
        {/*begin::Label*/}
        <span className="fw-bold text-gray-600 fs-6">Radio</span>
        {/*end::Label*/}
      </div>
      {/*ed::Item*/}
    </div>
    {/*ed::Item*/}
  </div>
  {/*ed::Items*/}
</>

      </div>
      {/* end::Body */}
    </div>
  )
}

export {ChartsWidgetCus1}

function getChartOptions(height: number): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500')
  const borderColor = getCSSVariableValue('--kt-gray-200')
  const baseColor = "#302A4E"
  const lightColor = "#f0edfa"

  return {
    series: [
      {
        name: 'Net Profit',
        data: [30, 40, 40, 90, 90, 70, 70],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
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
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
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
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
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
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
