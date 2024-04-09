import {Suspense, useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import axios from 'axios'
import { BASE_URL } from './Config/BaseUrl'


const App = () => {
  
  

  
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
        
       
      </I18nProvider>
    </Suspense>
  )
}

export {App}
