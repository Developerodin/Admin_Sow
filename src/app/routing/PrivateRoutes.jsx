import { FC, Suspense, useContext} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'

import UserContext from '../../Context/UserContext'

import { B2BUsers } from '../pages/ManageB2BUsers/B2BUsers'

import { B2BUserAdd } from '../pages/ManageB2BUsers/B2BUserAdd'
import { Vendors } from '../pages/Vendors/Vendors'
import { Rates } from '../pages/Rates/Rates'
import { Orders } from '../pages/Orders/Orders'
import { Categories } from '../pages/Categories/Categories'
import { Sales } from '../pages/Sales/Sales'
import { Plans } from '../pages/Plans/Plans'
import {CreatePlan} from '../pages/Plans/CreatePlan'
import { Accounts } from '../pages/Accounts/Accounts'
import { Users } from '../pages/Users/Users'
import { ViewUser } from '../pages/Users/ViewUser'
import { ViewCategories } from '../pages/Categories/ViewCategories'
import { CreateInvoice } from '../pages/Sales/CreateInvoice'
import { AddVendors } from '../pages/Vendors/AddVendors'
import { VendorsView } from '../pages/Vendors/VendorsView'
import { EditVendors } from '../pages/Vendors/EditVendors'
import { B2BOrders } from '../pages/Orders/B2BOrders'
import { AddB2BOrder } from '../pages/Orders/AddB2BOrder'
import { AddUsers } from '../pages/Users/AddUsers'
import { AddOrder } from '../pages/Orders/AddOrders'
import { EditOrder } from '../pages/Orders/EditOrders'
import { EditB2BOrder } from '../pages/Orders/EditB2BOrder'
import { ViewB2bOrder } from '../pages/Orders/ViewB2bOrder.jsx'
import { ProfileDetails } from '../modules/accounts/components/settings/cards/ProfileDetails'
import { Settings } from '../modules/accounts/components/settings/Settings'
import { Invoices }  from '../pages/Sales/Invoices'
import { SalesView } from '../pages/Sales/SalesView'
import { MarketRates } from '../pages/MarketRates/MarketRates'
import { CreateRate } from '../pages/MarketRates/CreateRate'
import { DailyRate } from '../pages/MarketRates/DailyRate'
import { UpdateDailyRates } from '../pages/MarketRates/UpdateDailyRates'
import { ExcelMarketRates } from '../pages/MarketRates/ExcelMarketRates'
import { CreateExcelRates } from '../pages/MarketRates/CreateExcelRates'
import { MandiRates } from '../pages/MarketRates/MandiRates'
import { MarketRatesView } from '../pages/MarketRates/MarketRatesView'









const PrivateRoutes = () => {
  const {userPermisson}=useContext(UserContext);

  return (
    <Routes>
      <Route element={<MasterLayout />}>
  
        
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
   
        <Route path='dashboard' element={<DashboardWrapper />} />
      
        <Route path='menu-test' element={<MenuTestPage />} />

        <Route path= 'dashboard/settings/myprofile' element={
          <SuspensedView>
            <ProfileDetails />
          </SuspensedView>
        } 
        />


        <Route path= 'dashboard/settings/*' element={
          <SuspensedView>
            <Settings />
          </SuspensedView>
        }
        />
        
     
       
        <Route
          path='vendors/*'
          element={
            <SuspensedView>
              <Vendors />
            </SuspensedView>
          }
        />

<Route
          path='vendors/add/*'
          element={
            <SuspensedView>
              <AddVendors />
            </SuspensedView>
          }
        />
        <Route
          path='vendors/view/:id'
          element={
            <SuspensedView>
              <VendorsView />
            </SuspensedView>
          }
        />
        <Route
          path='vendors/edit/:id'
          element={
            <SuspensedView>
              <EditVendors />
            </SuspensedView>
          }
        />

<Route
          path='rates/*'
          element={
            <SuspensedView>
              <Rates />
            </SuspensedView>
          }
        />

<Route
          path='orders/*'
          element={
            <SuspensedView>
              <Orders />
            </SuspensedView>
          }
        />
        <Route
          path='orders/add/*'
          element={
            <SuspensedView>
              <AddOrder />
            </SuspensedView>
          }
        />
        <Route
          path='orders/edit/:id'
          element={
            <SuspensedView>
              <EditOrder />
            </SuspensedView>
          }
        />
        <Route
          path='b2b_orders/*'
          element={
            <SuspensedView>
              <B2BOrders />
            </SuspensedView>
          }
        />
        <Route
          path='b2b_orders/add/*'
          element={
            <SuspensedView>
              <AddB2BOrder />
            </SuspensedView>
          }
        />
        <Route
          path='b2b_orders/view/:id'
          element={
            <SuspensedView>
              <ViewB2bOrder />
            </SuspensedView>
          }
        />
        <Route
          path='b2b_orders/edit/:id'
          element={
            <SuspensedView>
              <EditB2BOrder />
            </SuspensedView>
          }
        />

<Route
          path='categories/*'
          element={
            <SuspensedView>
              <Categories />
            </SuspensedView>
          }
        />

<Route
          path='categories/view-categorie/:id'
          element={
            <SuspensedView>
              <ViewCategories />
            </SuspensedView>
          }
        />

<Route
          path='sales/*'
          element={
            <SuspensedView>
              <Sales />
            </SuspensedView>
          }
        />
        <Route
          path='sales/create-invoice/*'
          element={
            <SuspensedView>
              <CreateInvoice />
            </SuspensedView>
          }
        />
      
        <Route
          path='sales/sales-view/*'
          element={
            <SuspensedView>
              <SalesView />
            </SuspensedView>
          }
          />
          <Route
          path='sales/sales-view/view/:id'
          element={
            <SuspensedView>
              <Invoices />
            </SuspensedView>
          }
          />


<Route
          path='plans/*'
          element={
            <SuspensedView>
              <Plans />
            </SuspensedView>
          }
        />
<Route
         path='plans/createplan/*'
        element={
          <SuspensedView>
            <CreatePlan />  
          </SuspensedView>
        }
        />   

<Route
          path='accounts/*'
          element={
            <SuspensedView>
              <Accounts />
            </SuspensedView>
          }
        />

<Route
          path='users/*'
          element={
            <SuspensedView>
              <Users />
            </SuspensedView>
          }
        />

<Route
          path='users/users_add/*'
          element={
            <SuspensedView>
              <AddUsers />
            </SuspensedView>
          }
        />
<Route
         path='users/view/:id'
        element={
           <SuspensedView>
             <ViewUser />
            </SuspensedView>
           }
           />
 

  

<Route
          path='b2b_users/*'
          element={
            <SuspensedView>
              <B2BUsers />
            </SuspensedView>
          }
        />
        <Route
          path='b2b_users_add/*'
          element={
            <SuspensedView>
              <B2BUserAdd />
            </SuspensedView>
          }
        />

       
<Route
          path='market-rates/*'
          element={
            <SuspensedView>
              <MarketRates />
            </SuspensedView>
          }
        />
<Route
          path='excel-market-rates/*'
          element={
            <SuspensedView>
              <ExcelMarketRates />
            </SuspensedView>
          }
        />

<Route
          path='mandi-rates/*'
          element={
            <SuspensedView>
              <MandiRates />
            </SuspensedView>
          } 
        /> 

<Route
           path='market-rates-view/:id'
            element={
              <SuspensedView>
                <MarketRatesView />
              </SuspensedView>
            }
          />               

        <Route
          path='daily-rates/*'
          element={
            <SuspensedView>
              <DailyRate />
            </SuspensedView>
          }
        />

<Route
         path='daily-rates/create-daily-rates/*'
        element={
          <SuspensedView>
            <UpdateDailyRates />  
          </SuspensedView>
        }
        /> 

<Route
         path='market-rates/create-rates/*'
        element={
          <SuspensedView>
            <CreateRate />  
          </SuspensedView>
        }
        /> 

<Route
          path='excel-market-rates/create-excel-rates/*'
          element={
            <SuspensedView>
              <CreateExcelRates />
            </SuspensedView>
          }
        />          




        {/* Page Not Found /error/404 */}

        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
