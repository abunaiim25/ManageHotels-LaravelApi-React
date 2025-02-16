import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import '../auth.css';
import GoogleSignin from "../GoogleSignin/GoogleSignin";


const Login = () => {
	  const history = useHistory();
	  document.title = "Login";
	
	  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
	  const [loginInput, setLogin] = useState({
		email: "",
		password: "",
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
		  setLogin({ ...loginInput, [e.target.name]: e.target.value });
		}
  
  
	  const loginSubmit = (e) => {
		  e.preventDefault();
         //button loading
	     setIsLoadingBtn(true); 
		  const data = {
			email: loginInput.email,
			password: loginInput.password,
		  }
		  // post using laravel api
		  axios.get('/sanctum/csrf-cookie').then(response => {
			axios.post(`/api/login`, data).then(res => {
				setIsLoadingBtn(false);
			  if (res.data.status === 200) {
				localStorage.setItem('auth_token', res.data.token);
				localStorage.setItem('auth_name', res.data.username);
				swal("Success", res.data.message, "success"); 
				if (res.data.role === 'admin') {
				  history.push('/admin/dashboard');// 
				}
				else {
				  history.push('/');// login to home page
				}
			  }
			  else if (res.data.status === 401) {
				swal("Warning", res.data.message, "warning");
			  }
			  else {
				setLogin({ ...loginInput, error_list: res.data.validation_errors });
			  }
			});
		  });
		}

  return (
    <>
    
		<div class="wrapper">
			<div class="inner">
				<form onSubmit={loginSubmit}>
					<h3>Log IN</h3>
					<div className="form-holder">
						<span className="lnr lnr-envelope"></span>
						<input type="email"  name="email" value={loginInput.email} class="form-control" placeholder="Email" onChange={handleInput}/>
						<span className="text-danger">{loginInput.error_list.email}</span>
					</div>
					<div className="form-holder">
						<span className="lnr lnr-lock"></span>
						<input type="password" name="password" value={loginInput.password} class="form-control" placeholder="Password" onChange={handleInput}/>
						<span className="text-danger">{loginInput.error_list.password}</span>
					</div>

					<button type="submit" class="btn btn-primary" style={{ width: "100%" }} disabled={isLoadingBtn}>
                            {isLoadingBtn ? "Please Wait, Logging..." : "Login"}
                   </button>

				   <div className="mt-3 text-center">
				       <div className="mb-3">
					   <GoogleSignin />
				       </div>
				   
				    <Link to="/register">Register account</Link>
				   </div>
				</form>
			</div>
			
		</div>
    </>
  )
}

export default Login