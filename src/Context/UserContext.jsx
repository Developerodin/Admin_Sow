import { createContext,useEffect,useState } from "react";
import Cookies from 'js-cookie';
import { BASE_URL } from "../app/Config/BaseUrl";
import axios from "axios";

 const UserContext=createContext();

export const UserContextProvider = ({ children }) => {
    // Define the data or state you want to share
    const [userData,setUserData]=useState({});
    const [userRole,setUserRole]=useState({});
    const[userPermisson,setUserPermisson]=useState({});
    const [userToken,setUserToken]=useState("");
    const [Refresh, setRefresh] =useState(0);
    const [update,setUpdated]=useState(0)

    // Functions
    
    const GetToken=async()=>{
        try{
              const res=await axios.get(BASE_URL+"/token");
              const data=await res.data;
              console.log(data);
            //    localStorage.setItem('token',data.token);
            
               sessionStorage.setItem('token',data.token);
               setUserToken(data.token);
               
        }
        catch(err){
         console.log("Error", err)
        }
   }

    const UserDetailsSet=()=>{
        const storedUser = JSON.parse(sessionStorage.getItem('User'));
        console.log("user in session storage ",storedUser)
        setUserData(storedUser);

    }
    
    const fetchuserRole=async()=>{
      const token =sessionStorage.getItem('token');
      
        try {
            const response = await axios.get(`${BASE_URL}/roles/${userData.role}`, { headers: { Authorization: token } });
            
            const data=await response.data
            console.log('User role:',data.permissions,data.name);
            setUserRole(data.name);
            sessionStorage.setItem('role',data.name);
            sessionStorage.setItem('userPermisson', JSON.stringify(data.permissions));
            setUserPermisson(data.permissions);
          } catch (error) {
            console.error('Error in fech user  role:', error);
           
          }
    }

    const fetchUserData = async () => {
      const user=JSON.parse(sessionStorage.getItem('User'))
      const token = sessionStorage.getItem('token')
      try {
        const response = await axios.get(`${BASE_URL}/users/${user._id}`, { headers: { Authorization: token } });
        sessionStorage.setItem('User', JSON.stringify(response.data));
        setUserData(response.data);
        
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    
    
    useEffect(()=>{
        // GetToken();
        UserDetailsSet();
    },[update])

    useEffect(()=>{
      fetchUserData()
    },[userToken])

    useEffect(() => {
        if (userData && userData.role) {
            fetchuserRole();
            
        }
      }, [userData,userToken,Refresh]);
    
    return (
      // Provide the value to the components that consume this context
      <UserContext.Provider value={{setUserData,userData,userRole,setUserRole,setUserPermisson,userPermisson,userToken,setRefresh,setUpdated}}>
        {children}
      </UserContext.Provider>
    );
  };
  
  export default UserContext;