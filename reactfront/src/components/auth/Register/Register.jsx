import React, { useState, useEffect } from "react";
import '../auth.css';
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleSignin from "../GoogleSignin/GoogleSignin";


const Register = () => {
  const history = useHistory();
  document.title = "Register";

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [registerInput, setRegister] = useState({
    name: "",
    email: "",
    password: "",
	  password_confirmation:"",
    error_list: [],
  });


  // Redirect to home page if already logged in
  const [user, setUser] = useState("");
  useEffect(() => {
  if (localStorage.getItem("auth_token")) {
    axios.get("/api/me").then((response) => {
    setUser(response.data);
    });
   }
  }, []);
  useEffect(() => {
  if (user) {
    history.push("/"); 
    }
  }, [user, history]);



  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };


  const registerSubmit = (e) => {
    e.preventDefault();

    //button loading
     setIsLoadingBtn(true); 

    const data = {
      name: registerInput.name,
      email: registerInput.email,
      phone: registerInput.phone,
      password: registerInput.password,
      password_confirmation: registerInput.password_confirmation,
    };

    // post using laravel api
    axios.get("/sanctum/csrf-cookie").then((response) => {
      axios.post(`/api/register`, data).then((res) => {
		    setIsLoadingBtn(false);
        if (res.data.status === 200) {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_name", res.data.username);
          swal("Success", res.data.message, "success");
          history.push("/login");
        } else {
          setRegister({
            ...registerInput,
            error_list: res.data.validation_errors,
          });
        }
      });
    });
  };

  return (
    <>
    		<div class="wrapper">
			<div class="inner">
				<img src="images/image-1.png" alt="" class="image-1"/>
				<form onSubmit={registerSubmit}>
					<h3>New Account?</h3>
					
          <div className="form-holder">
						<span className="lnr lnr-user"></span>
						<input type="text" name="name" value={registerInput.name} class="form-control" placeholder="Username" onChange={handleInput}/>
						<span className="text-danger">{registerInput.error_list.name}</span>
					</div>
					
					<div className="form-holder">
						<span className="lnr lnr-envelope"></span>
						<input type="email"  name="email" value={registerInput.email} class="form-control" placeholder="Email" onChange={handleInput}/>
						<span className="text-danger">{registerInput.error_list.email}</span>
					</div>
					<div className="form-holder">
						<span className="lnr lnr-lock"></span>
						<input type="password" name="password" value={registerInput.password} class="form-control" placeholder="Password" onChange={handleInput}/>
						<span className="text-danger">{registerInput.error_list.password}</span>
					</div>
					<div className="form-holder">
						<span className="lnr lnr-lock"></span>
						<input type="password" name="password_confirmation" value={registerInput.password_confirmation} class="form-control" placeholder="Confirm Password" onChange={handleInput}/>
						<span className="text-danger">{registerInput.error_list.password_confirmation}</span>
					</div>

					<button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoadingBtn}>
                            {isLoadingBtn ? "Please Wait, Registering..." : "Register"}
          </button>

          <div className="mt-3 text-center">
              <div className="mb-3">
					        <GoogleSignin />
				       </div>
				  <Link to="/login">Login account</Link>
				   </div>
				</form>
			</div>
		</div>
    </>
  )
}

export default Register