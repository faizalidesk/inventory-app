import {
useState
}
from "react";


import {
supabase
}
from "../../lib/supabase";


import {
useNavigate
}
from "react-router-dom";



export default function Register(){


const navigate =
useNavigate();



const [form,setForm]
=
useState({

name:"",
email:"",
password:""

});



function change(e){

setForm({

...form,

[e.target.name]:
e.target.value

});

}



async function register(){



const {
data,
error
}
=
await supabase.auth
.signUp({

email:
form.email,


password:
form.password,


options:{

data:{

full_name:
form.name

}

}

});



if(error){

alert(error.message);

return;

}



alert(
"Register berhasil"
);


navigate("/");


}




return (

<div>


<h1>
Register
</h1>



<input

name="name"

placeholder="Nama"

onChange={change}

/>



<input

name="email"

placeholder="Email"

onChange={change}

/>



<input

name="password"

type="password"

placeholder="Password"

onChange={change}

/>



<button
onClick={register}
>

Register

</button>



</div>

);


}