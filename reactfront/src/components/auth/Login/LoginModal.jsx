import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import '../auth.css';
import GoogleSigninModal from "../GoogleSignin/GoogleSigninModal";


const LoginModal = () => {
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
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    setIsLoadingBtn(true); 
    const data = {
      email: loginInput.email,
      password: loginInput.password,
    };

    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post(`/api/login`, data).then(res => {
        setIsLoadingBtn(false);
        if (res.data.status === 200) {
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('auth_name', res.data.username);
          //window.location.reload(); 
          swal("Success", res.data.message, "success"); 

          // Close modal before redirecting
          const modal = document.getElementById('login');
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
          if (modalBackdrop) {
            modalBackdrop.remove();
          }
          document.body.classList.remove("modal-open");

          if (res.data.role === 'admin') {
            history.push('/admin/dashboard');
          } else {
            window.location.reload();
            history.push('/');
          }
        } else if (res.data.status === 401) {
          swal("Warning", res.data.message, "warning");
        } else {
          setLogin({ ...loginInput, error_list: res.data.validation_errors });
        }
      });
    });
  };

  return (
    <>
      <div className="modal fade" id="login" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loginLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginLabel">Login Account</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="wrapper" style={{ minHeight: '70vh' }}>
                <div className="inner">
                  <form onSubmit={loginSubmit}>
                    <h3>Log IN</h3>
                    <div className="form-holder">
                      <span className="lnr lnr-envelope"></span>
                      <input type="email" name="email" value={loginInput.email} className="form-control" placeholder="Email" onChange={handleInput} />
                      <span className="text-danger">{loginInput.error_list.email}</span>
                    </div>
                    <div className="form-holder">
                      <span className="lnr lnr-lock"></span>
                      <input type="password" name="password" value={loginInput.password} className="form-control" placeholder="Password" onChange={handleInput} />
                      <span className="text-danger">{loginInput.error_list.password}</span>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoadingBtn}>
                      {isLoadingBtn ? "Please Wait, Logging..." : "Login"}
                    </button>

                    <div className="mt-3 text-center">
                      <div className="mb-3">
                        {/* Google Login inside Modal */}
                        <GoogleSigninModal 
                            onLoginSuccess={() => {
                            history.push("/");  // Navigate to the home page
                            window.location.reload();  // Reload the page
                          }} 
                        />
                      </div>
                      <Link to="/register">Register account</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
