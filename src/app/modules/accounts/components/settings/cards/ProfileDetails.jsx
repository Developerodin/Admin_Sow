import React, {useContext, useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails, profileDetailsInitValues as initialValues} from '../SettingsModel'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { EditUser } from '../../../../auth/components/EditUser'
import UserContext from '../../../../../../Context/UserContext'
import clsx from 'clsx'
import { BASE_URL } from '../../../../../Config/BaseUrl'
import axios from 'axios'
import Alert from '@mui/material/Alert';
import { Box, Modal } from '@mui/material'
import { Button } from 'react-bootstrap'
const profileDetailsSchema = Yup.object().shape({
  fName: Yup.string().required('First name is required'),
  lName: Yup.string().required('Last name is required'),
  company: Yup.string().required('Company name is required'),
  contactPhone: Yup.string().required('Contact phone is required'),
  companySite: Yup.string().required('Company site is required'),
  country: Yup.string().required('Country is required'),
  language: Yup.string().required('Language is required'),
  timeZone: Yup.string().required('Time zone is required'),
  currency: Yup.string().required('Currency is required'),
})
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  width:"40%",
  p: 4,
  overflow:"auto"
};
const ProfileDetails= () => {
  const user=JSON.parse(sessionStorage.getItem('User')) || '{}';
  const [data, setData] = useState(initialValues)
  const {setUpdated,userToken,userRole}=useContext(UserContext)
  const token = sessionStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const[open,setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState(false);

  const formik = useFormik({
    initialValues: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        changepassword: '',
        role:userRole ,
        acceptTerms: false,
        userStatus:user.status, // Add the userStatus field
      },
  validationSchema: Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    changepassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    role: Yup.string().required('Role is required'),
    acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
  }),
  onSubmit: async (values, { setStatus, setSubmitting }) => {
    
    const requestData = {
        email: values.email,
        name: values.firstname + ' ' + values.lastname,
        password: values.password,
        role: values.role,
        status: userStatus, // Add the userStatus field
      };
      
      
      
      console.log("VAlues", requestData)
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/users/${user._id}`, requestData, { headers: { Authorization: token } });
      console.log('User edit response:', response.data);
      if(response.data){
        sessionStorage.setItem('User', JSON.stringify(response.data));
        setOpen(true);
        setLoading(false);
        setUpdated((prev)=>prev+1);
        setTimeout(()=>{
          setOpen(false)
        },2000)
      }
      
     
    } catch (error) {
      console.error('Error editing user:', error);
      setLoading(false);
      setStatus('Failed to edit user');
    }
    setSubmitting(false);
  },
});

useEffect(() => {
  

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${user._id}`, { headers: { Authorization: token } });
      setUserData(response.data);
      setUserStatus(response.data.status); // Set the user status
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  
  fetchUserData();
}, []);

useEffect(() => {
    if (userData) {
      // Split the name into first name and last name based on space
      const [firstName, ...lastNameArr] = userData.name.split(' ');
      const lastName = lastNameArr.join(' ');

      formik.setValues({
        firstname: firstName,
        lastname: lastName,
        email: userData.email,
        password: '',
        changepassword: '',
        role: userData.role,
      });
    }
  }, [userData]);



  return (
    <div className='card mb-5 mb-xl-10'>
      {
        user && 
        <div> 
        <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>

        

        <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_signup_form'
        onSubmit={formik.handleSubmit}
      >
        {/* begin::Heading */}
        <div className='text-center mb-11'>
          {/* begin::Title */}
          
          {/* end::Title */}
  
          {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
        </div>
        {/* end::Heading */}
  
        {/* begin::Login options */}
        
        {/* end::Login options */}
        <div >
              <label className='col-lg-4 col-form-label fw-bold fs-6'>Avatar</label>
              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{backgroundImage: `url(${toAbsoluteUrl('/media/avatars/blank.png')})`}}
                >
                  <input type='file' />
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{backgroundImage: `url(${toAbsoluteUrl(data.avatar)})`}}
                  ></div>
                </div>
              </div>
            </div>
        
  
        {formik.status && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        )}
  
        {/* begin::Form group Firstname */}
        <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-dark fs-6'>First name</label>
          <input
            placeholder='First name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('firstname')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.firstname && formik.errors.firstname,
              },
              {
                'is-valid': formik.touched.firstname && !formik.errors.firstname,
              }
            )}
          />
          {formik.touched.firstname && formik.errors.firstname && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstname}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
        <div className='fv-row mb-8'>
          {/* begin::Form group Lastname */}
          <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
          <input
            placeholder='Last name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('lastname')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.lastname && formik.errors.lastname,
              },
              {
                'is-valid': formik.touched.lastname && !formik.errors.lastname,
              }
            )}
          />
          {formik.touched.lastname && formik.errors.lastname && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.lastname}</span>
              </div>
            </div>
          )}
          {/* end::Form group */}
        </div>
  
        {/* begin::Form group Email */}
        <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-dark fs-6'>Email</label>
          <input
            placeholder='Email'
            type='email'
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
  
        {/* begin::Form group Password */}
        <div className='fv-row mb-8' data-kt-password-meter='true'>
          <div className='mb-1'>
            <label className='form-label fw-bolder text-dark fs-6'>Password</label>
            <div className='position-relative mb-3'>
              <input
                type='password'
                placeholder='Password'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                className={clsx(
                  'form-control bg-transparent',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            {/* begin::Meter */}
            <div
              className='d-flex align-items-center mb-3'
              data-kt-password-meter-control='highlight'
            >
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
            </div>
            {/* end::Meter */}
          </div>
          <div className='text-muted'>
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </div>
        </div>
        {/* end::Form group */}
  
        {/* begin::Form group Confirm password */}
        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
          <input
            type='password'
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('changepassword')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
              },
              {
                'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
              }
            )}
          />
          {formik.touched.changepassword && formik.errors.changepassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.changepassword}</span>
              </div>
            </div>
          )}
        </div>
  
  
        



   

        {/* end::Form group */}
  
        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
            <input
              className='form-check-input'
              type='checkbox'
              id='kt_login_toc_agree'
              {...formik.getFieldProps('acceptTerms')}
            />
            <span>
              I Accept the{' '}
              <a
                href='https://keenthemes.com/metronic/?page=faq'
                target='_blank'
                className='ms-1 link-primary'
              >
                Terms
              </a>
              .
            </span>
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
  
        {/* begin::Form group */}
        <div className='text-center'>
          <button
            type='submit'
            id='kt_sign_up_submit'
            className='btn btn-lg btn-primary w-50 mb-5'
            disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
          >
            {!loading && <span className='indicator-label'>Save</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          
            
          
        </div>
        {/* end::Form group */}
      </form>
      </div>

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            

        <Alert severity="success">User Updated</Alert>

      




        </Box>
      </Modal>
      </div>
      }
      
         
    </div>
  )
}

export {ProfileDetails}
