//https://www.npmjs.com/package/@react-oauth/google
//npm i @react-oauth/google  
//Google Cloud console = https://console.cloud.google.com/welcome?project=idyllic-mantis-440511-j9
// npm i jwt-decode
//https://www.npmjs.com/package/jwt-decode

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";


const GoogleSignin = () => {
  const history = useHistory();

const HandleSuccess = (credentialResponse) => {
    console.log("Google Sign Is Success", credentialResponse);
    const decoded = jwtDecode(credentialResponse?.credential)
    console.log(decoded);

    // Call an async function to handle the request
    const sendUserData = async () => {
      try {
          const response = await axios.post("/api/google-login", {
              name: decoded.name,
              email: decoded.email,
              google_id: decoded.sub, // Google User ID
          });

          console.log("Response from backend:", response.data);

          if (response.data.token) {
              localStorage.setItem("auth_token", response.data.token);
              localStorage.setItem("auth_user", JSON.stringify(response.data.user));

              swal("Success", "Logged in successfully", "success");
              history.push('/'); // Redirect to homepage
          } else {
              swal("Error", "Login failed", "error");
          }
      } catch (error) {
          console.error("Error sending data to backend:", error);
          swal("Error", "Something went wrong!", "error");
      }
  };
    sendUserData();
};


const HandleError = () => {
    console.log("Google Sign Is Error");
}


  return (
    <>
      <GoogleOAuthProvider clientId="717382971709-todi83f6pots7jqusfbg9f3unvg07q2f.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={HandleSuccess}
          onError={HandleError}
        />
        
      </GoogleOAuthProvider>
    </>
  );
};

export default GoogleSignin;
