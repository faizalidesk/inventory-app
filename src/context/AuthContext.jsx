import {
createContext,
useContext,
useEffect,
useState
}
from "react";


import {
supabase
}
from "../lib/supabase";



const AuthContext =
createContext();



export function AuthProvider({
children
}){


const [user,setUser]
=
useState(null);


const [loading,setLoading]
=
useState(true);



useEffect(()=>{


// cek user saat refresh

supabase.auth
.getSession()
.then(({data})=>{


setUser(
data.session?.user ?? null
);


setLoading(false);


});




// listen perubahan login/logout

const {
data:{
subscription
}
}
=
supabase.auth
.onAuthStateChange(
(
event,
session
)=>{


setUser(
session?.user ?? null
);


}
);



return ()=>{

subscription.unsubscribe();

};


},[]);




async function logout(){


await supabase.auth.signOut();


setUser(null);


}



return (

<AuthContext.Provider

value={{
user,
logout,
loading
}}

>

{children}

</AuthContext.Provider>


);


}



export function useAuth(){

return useContext(AuthContext);

}