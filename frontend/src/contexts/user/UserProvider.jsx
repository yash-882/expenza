import axios from "axios";
import { useEffect, useState } from "react";
import { UserContext } from "../UserContext";


function UserProvider(props) {
    let [isAuthenticated, setIsAuthenticated] = useState(true)

    async function isUserAuthenticated(){
        try{
          // throws error if unauthorized to this page
        await axios.get('http://192.168.1.7:8000/api/transaction', {
          withCredentials: true
        })
    }
    catch(err){
            if(err.response){
              // not authenticated
            setIsAuthenticated(false)
            }  
        }
    }

    useEffect(()=> {
      isUserAuthenticated()
    }, [])


  return (
    <UserContext.Provider   value={{isAuthenticated, setIsAuthenticated}}>

      { props.children }

    </UserContext.Provider>
  )
}

export default UserProvider
