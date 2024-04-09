import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import { BASE_URL } from '../../../Config/BaseUrl'

const API_URL = process.env.REACT_APP_API_URL
const token =sessionStorage.getItem('token');

export const GET_USER_BY_ACCESSTOKEN_URL = `${BASE_URL}/verify_token`
export const LOGIN_URL = `${BASE_URL}/signin`
export const REGISTER_URL = `${BASE_URL}/signup`
export const REQUEST_PASSWORD_URL = `${BASE_URL}/forgotPassword`
export const RESET_PASSWORD_URL = `${BASE_URL}/resetPassword/`

// Server should return AuthModel
export function login(email: string, password: string) {
 
  return axios.post(LOGIN_URL, {
    email,
    password,
  },{ headers: { "Authorization": `${token}` } })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string,
  role: string
) {
  return axios.post(REGISTER_URL, {
    email:email,
    name: firstname+" "+lastname,
    password:password,
    role:role,
  },{ headers: { "Authorization": `${token}` } })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    email:email,
  },{ headers: { "Authorization": `${token}` } })
}

export function resetPassword(password: string,ResetToken: string) {
  return axios.patch(RESET_PASSWORD_URL+ResetToken, {
    password:password,
  },{ headers: { "Authorization": `${token}` } })
}


export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}
