import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

const GoogleSigninModal = ({ onLoginSuccess }) => {
  const history = useHistory();

  const HandleSuccess = (credentialResponse) => {
    console.log("Google Sign-In Success", credentialResponse);

    if (!credentialResponse?.credential) {
      console.error("No credential received");
      return;
    }

    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);

    // Send user data to backend
    const sendUserData = async () => {
      try {
        const response = await axios.post("/api/google-login", {
          name: decoded.name,
          email: decoded.email,
          google_id: decoded.sub,
        });

        console.log("Response from backend:", response.data);

        if (response.data.token) {
          localStorage.setItem("auth_token", response.data.token);
          localStorage.setItem("auth_user", JSON.stringify(response.data.user));

          swal("Success", "Logged in successfully", "success");
          history.push("/");
          onLoginSuccess(); // Trigger success callback passed as prop
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
    console.log("Google Sign-In Error");
    swal("Error", "Google login failed", "error");
  };

  return (
    <GoogleLogin
      onSuccess={HandleSuccess} // Directly use HandleSuccess as the callback
      onError={HandleError}
    />
  );
};

export default GoogleSigninModal;
