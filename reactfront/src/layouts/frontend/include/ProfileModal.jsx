import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";


const ProfileModal = () => {

    const [user, setUser] = useState("");
    useEffect(() => {
      if (localStorage.getItem("auth_token")) {
      axios.get("/api/me").then((response) => {
        //console.log(response.data.name);
        setUser(response.data);
      });
    }
    }, []);

  return (
    <>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Profile Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      
      <div class="modal-body">
      <h5>Name: {user.name}</h5>
      <h5>Email: {user.email}</h5>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default ProfileModal