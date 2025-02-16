import React from 'react';
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginTop:'150px' }}>
     <h1>Admin Panel - Dashboard</h1>
      <br />
    </div>
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
      <Link to="/"><b> Go to Manage Hotels Page</b></Link>
    </div>
    </>
  )
}

export default Dashboard