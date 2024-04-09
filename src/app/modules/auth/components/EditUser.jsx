import {useState, useEffect, useContext} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {getUserByToken, register} from '../core/_requests'
import {Link, useNavigate} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {useAuth} from '../core/Auth'
import axios from 'axios'
import { BASE_URL } from '../../../Config/BaseUrl'
import UserContext from '../../../../Context/UserContext'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  role:'',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
    role: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('role is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export const EditUser = ({handleClose,userId,setUpdated}) => {
  const {userToken}=useContext(UserContext);
  const token =sessionStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [userData, setUserData] = useState(null);
    const [userStatus, setUserStatus] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            changepassword: '',
            role: '',
            acceptTerms: false,
            userStatus: false, // Add the userStatus field
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
          const response = await axios.put(`${BASE_URL}/users/${userId}`, requestData, { headers: { Authorization: token } });
          console.log('User edit response:', response.data);
          setLoading(false);
          setUpdated((prev)=>prev+1);
          handleClose();
        } catch (error) {
          console.error('Error editing user:', error);
          setLoading(false);
          setStatus('Failed to edit user');
        }
        setSubmitting(false);
      },
    });
  
    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/roles`, { headers: { Authorization: token } });
          setRoles(response.data);
        } catch (error) {
          console.log('Error fetching roles:', error);
        }
      };
  
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/users/${userId}`, { headers: { Authorization: token } });
          setUserData(response.data);
          setUserStatus(response.data.status); // Set the user status
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      };
  
      fetchRoles();
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
  
    useEffect(() => {
      PasswordMeterComponent.bootstrap()
    }, [])
  
    
  
    return (
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_signup_form'
        onSubmit={formik.handleSubmit}
      >
        {/* begin::Heading */}
        <div className='text-center mb-11'>
          {/* begin::Title */}
          <h1 className='text-dark fw-bolder mb-3'>EDIT  USER</h1>
          {/* end::Title */}
  
          {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
        </div>
        {/* end::Heading */}
  
        {/* begin::Login options */}
        
        {/* end::Login options */}
  
        
  
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
  
  
        <div className="fv-row mb-5">
          <label className="form-label fw-bolder text-dark fs-6">Role</label>
          <select
            {...formik.getFieldProps('role')}
            className={clsx(
              'form-select bg-transparent',
              {
                'is-invalid': formik.touched.role && formik.errors.role,
              },
              {
                'is-valid': formik.touched.role && !formik.errors.role,
              }
            )}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.role}</span>
              </div>
            </div>
          )}
        </div>



        <div className="fv-row mb-8">
  <div className="form-check form-switch form-switch-sm">
    <input
      className="form-check-input"
      type="checkbox"
      id="userStatus"
      checked={userStatus} // Set the checked value based on the userStatus state
      onChange={(e) => setUserStatus(e.target.checked)} // Update the userStatus state when the checkbox is toggled
    />
    <label className="form-check-label" htmlFor="userStatus">
      Enable User
    </label>
  </div>
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
            className='btn btn-lg btn-primary w-100 mb-5'
            disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
          >
            {!loading && <span className='indicator-label'>Submit</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          
            <button
              type='button'
              id='kt_login_signup_form_cancel_button'
              onClick={handleClose}
              className='btn btn-lg btn-light-primary w-100 mb-5'
            >
              Cancel
            </button>
          
        </div>
        {/* end::Form group */}
      </form>
  )
}
