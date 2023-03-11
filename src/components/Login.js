import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let Navigate = useNavigate();
    const handleonSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body:JSON.stringify({email:credentials.email, password:credentials.password})
          });
          const json = await response.json();
          console.log(json);
          if (json.success){
            //Save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged-In Sucessfully ","success");
            Navigate("/");
          }
          else{
            props.showAlert("Invalid Credentials ","danger");
          }
    }
    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className='mt-2'>
      <h2>Login to Continue in MyStickyNotebook</h2>
      <form onSubmit={handleonSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" name="email" onChange={onChange} value={credentials.email} id="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" name="password" onChange={onChange} value={credentials.password} id="password"/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Login
