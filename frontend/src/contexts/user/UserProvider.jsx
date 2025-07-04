import axios from "axios";
import { useEffect, useState } from "react";
import { UserContext } from "../UserContext";

function UserProvider(props) {
     let [response, setResponse] = useState(false)
     let [isAuthenticated, setIsAuthenticated] = useState(false)


    async function isUserAuthenticated(){
        try{

          // throws error if unauthorized to this page
        await axios.get('http://192.168.1.7:8000/api/transaction', {
          withCredentials: true
        })
        
        setResponse(true) //marks that the authentication status is fetched
        setIsAuthenticated(true) // user is authenticated

    }
    catch(err){
        setResponse(true) //marks that the authentication status is fetched

            if(err.response){
              // not authenticated
            setIsAuthenticated(false)
            }  
        }
    }

    // runs on the first mount and when the dependencies change
    useEffect(()=> {
      isUserAuthenticated()
    }, [isAuthenticated, response])


  return (
    <UserContext.Provider value={{isAuthenticated, setIsAuthenticated}}>

{/* return routes only if the respone is received */}
      { response && props.children }

    </UserContext.Provider>
  )
}

export default UserProvider
