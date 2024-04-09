import {FC, useState} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG, WithChildren} from '../../../../helpers'
import {useLayout} from '../../../core'
import SVG from 'react-inlinesvg'
type Props = {
  to: string
  title: string
  icon?: any
  fontIcon?: string
  hasBullet?: boolean
}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {app} = config

  const [isHovered, setIsHovered] = useState(false);

  const linkStyle = {
    color: isActive ? '#fff' : isHovered ? 'orange' : '#fff',
    fontSize:"18px",
    fontWeight:"bold",
    marginTop:"3px",
    marginLeft:"3px",
  };

  let iconStyle = {
    color: isActive ? '#fff' : isHovered ? 'teal' : 'black',
  };

  return (
    <div className={`menu-item ${isActive ? 'active' : ''}`} style={{marginTop:"20px"}}>
    <Link
      className={clsx('menu-link without-sub', { active: isActive })}
      to={to}
      style={linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasBullet && (
        <span className="menu-bullet">
          <span className="bullet bullet-dot"></span>
        </span>
      )}
      {icon  && (
        <span className="menu-icon">
          {/* <KTSVG path={icon} className="svg-icon-2" /> */}
          <span >
      {/* <SVG src={icon} className={"mh-50px"} style={iconStyle} /> */}
      {icon}
    </span>
        </span>
      )}
      {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
        <i className={clsx('bi fs-3', fontIcon)}></i>
      )}
      <span className="menu-title" style={linkStyle}>
        {title}
      </span>
      <span className="menu-arrow"></span>
    </Link>
    {children}
  </div>
  )
}

export {SidebarMenuItem}
