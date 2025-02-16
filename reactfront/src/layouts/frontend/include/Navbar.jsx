import axios from 'axios';
import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import "./Navbar.css";
import ProfileModal from './ProfileModal';
import LoginModal from '../../../components/auth/Login/LoginModal';
import RegisterModal from '../../../components/auth/Register/RegisterModal';


const Navbar = () => {
      
      const history = useHistory();
      const [isLoadingBtn, setIsLoadingBtn] = useState(false);
      
      //Logout here
      const logoutSubmit = (e) => {
        e.preventDefault(); //for browser not reload
        
        // Btn Start loading
        setIsLoadingBtn(true); 
    
        axios.post("/api/logout").then((res) => {
          setIsLoadingBtn(false);
          
          if (res.data.status === 200) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_name");
            swal("Success", res.data.message, "success");
            history.push("/");
          }
        });
      };

  return <>
  
  <div class="site-mobile-menu site-navbar-target">
    <div class="site-mobile-menu-header">
      <div class="site-mobile-menu-close mt-3">
        <span class="icon-close2 js-menu-toggle"></span>
      </div>
    </div>
    <div class="site-mobile-menu-body"></div>
  </div>


  <div class="top-bar">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <a href="#" class=""><span class="mr-2 "></span> <span
              class="d-none d-md-inline-block"><i class="fa-solid fa-envelope"></i> rayhan@ba-systems.com</span></a>
          <span class="mx-md-2 d-inline-block"></span>
          <a href="#" class=""><span class="mr-2 "></span> <span
              class="d-none d-md-inline-block"><i class="fa-solid fa-phone"></i> +8801316057864</span></a>


          <div class="float-right">
            <span className="mx-2">
                 <a href="https://github.com/abunaiim25" target='_blank'> <i class="fa-brands fa-github"></i> Github</a>
            </span>
            <span className="mx-2">
                 <a href="https://www.linkedin.com/in/abu-naiim-516949210/" target='_blank'> <i class="fa-brands fa-linkedin"></i> Linkedin</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <header class="site-navbar js-sticky-header site-navbar-target" role="banner">

    <div class="container">
      <div class="row align-items-center position-relative">


        <div class="site-logo">
          <Link to="/" class="text-black"><span class="text-primary">Rayhan Hotel </span> </Link>
        </div>

        <div class="col-12">
          <nav class="site-navigation text-right ml-auto " role="navigation">

            <ul class="site-menu main-menu js-clone-nav ml-auto d-none d-lg-block">

              <li>
                <Link to="/" class="nav-link">Manage Hotels</Link>
              </li>


              {!localStorage.getItem("auth_token") ? (
              <>
                <li>
                    <a type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#login">Login</a>
                    <LoginModal />
                </li>
                <li>
                   <a type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#register">Register</a>
                   <RegisterModal />
                </li>
              </>
              ) : (
              <>
                <li>
                     {/* Profile modal  */}
                    <a type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#exampleModal">Profile</a>
                    <ProfileModal />
                </li>
                <li>
                   <input type="button" className='btn_logout' value={isLoadingBtn ? "Logging out..." : "Logout"} onClick={logoutSubmit}  disabled={isLoadingBtn}/>
                </li>
              </>
              )}
            </ul>
          </nav>

        </div>

        <div class="toggle-button d-inline-block d-lg-none"><a href="#"
            class="site-menu-toggle py-5 js-menu-toggle text-black"><span class="icon-menu h3"></span></a></div>

      </div>
    </div>

  </header>

  </>;
};

export default Navbar;
