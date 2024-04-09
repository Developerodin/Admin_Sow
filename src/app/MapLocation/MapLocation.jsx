import * as React from "react";




const MapLocation = (props) => {
  const {data} = props;
  const url =`https://maps.google.com/maps?q=26.509904,75.410153&hl=es&z=14&amp;output=embed`
setTimeout(()=>{console.log(url,data)},2000)
const[values,setValues]=React.useState("")

React.useEffect(() => {
  setValues(url)

  
}, [data])

  return (
    <div>
   <iframe 
  width="100%" 
 
  height="400px"
src = "https://maps.google.com/maps?q=26.509904,75.410153&hl=es&z=14&amp;output=embed"
  frameborder="0" 
  scrolling="no" 
  marginheight="0" 
  marginwidth="0" 
 >
 </iframe>
    </div>
  );
};

export default MapLocation;
