import { useState , createContext, useContext } from "react";
import { registerRequest } from '../api/auth';




export const AuthContext = createContext()

export const useAuth =() =>{
const context = useContext(AuthContext)
    if (!context){
        throw new Error("useAuth debe estar dentro de un provider");
    }
    return context;
};



export const AuthProvider = ({children}) =>{
const [user,setUser] = useState(null)
const [isAuthenticated,setIsAuthenticated] = useState(false);


const signup = async (user) =>{
    try{
    const res = await registerRequest(user);
        console.log(res.data);
        setUser(res.data);
        setIsAuthenticated(true);
    }
    catch(error){
console.log(error);
    }
};
    return(
    <AuthContext.Provider value={{ 
        signup,
        user,
        isAuthenticated,
    }}>{children}</AuthContext.Provider>
);
};