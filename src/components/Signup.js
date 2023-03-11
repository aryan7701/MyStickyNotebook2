import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'


const Signup = (props) => {

  const [credentials, setCredentials] = useState({name:"",email:"",password:"", cpassword:""})
  const Navigate = useNavigate();
  const handleonSubmit = async (e)=>{
    e.preventDefault();
    const {name,email,password}= credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name,email, password})
      });
      const json = await response.json();
      console.log(json);
      if (json.success){
        //Save the authtoken and redirect
        localStorage.setItem('token', json.authtoken);
        Navigate("/");
        props.showAlert("Signed-Up Sucessfully ","success");
      }
      else{
        props.showAlert("Invalid Credentials","danger");
      }
}
const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}

  return (
    
    <div className="container mt-2">
      <h2>Create an account to Continue in MyStickyNotebook</h2>
      <form onSubmit={handleonSubmit}>
      <div className="my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" name="name" onChange={onChange} id="name" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="text" className="form-control" name="email" onChange={onChange} id="email" aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" onChange={onChange} id="password" minLength={5} reqiured="true"/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">ConfirmPassword</label>
          <input type="password" className="form-control" name="cpassword" onChange={onChange} id="cpassword" minLength={5} reqiured="true"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
