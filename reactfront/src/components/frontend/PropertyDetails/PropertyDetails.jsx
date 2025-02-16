import { React, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { PUBLIC_URL } from "../../../PUBLIC_URL";
//npm install react-share
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share"; // Import sharing components

const PropertyDetails = () => {
  const { id } = useParams(); // Extract ID and slug
  // const navigate = useNavigate();
  const history = useHistory();

  document.title = "Property Details";

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({
    property_name: "",
    cost_per_night: "",
    number_of_available_rooms: "",
    Average_rating: "",
    address: "",
  });

  // data fetch
  useEffect(() => {
    console.log("ID:", id);

    axios
      .get(`/api/property-details/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setInput(res.data.hotel);
        } else if (res.data.status === 404) {
          swal("Error", res.data.message, "error");
          history.push("/");
        }
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        swal("Error", "Something went wrong.", "error");
        setLoading(false); // Stop loading on error
      });
  }, [id, history]);

  // Delete
  const deleteProduct = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Please wate, Deleting...";

    if (!window.confirm("Are you sure you want to delete this hotel?")) {
      return; // Stop execution if user cancels
    }

    axios.delete(`/api/delete-hotel/${id}`).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        thisClicked.closest(".card").remove();
        history.push("/");
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
        thisClicked.innerText = "Delete";
      }
      setLoading(false);
    });
  };

  // Social Media Share Link
  const shareLink = `${window.location.origin}/property-details/${id}`;

  // Loading state
  if (loading) {
    return (
      <>
        <div className="container">
          <h1 className="text-center mt-5">Loading Hotel...</h1>
        </div>
      </>
    );
  }

  return <>
   <div className="propertyDetails">
    <div className="container">
      <div className="card">
        <div className='d-flex justify-content-between px-3 pt-3'>
          <h4 style={{ color:'black', fontWeight:'600' }}>Property Details</h4>

          <div>
            <Link to={`edit-hotel/${input.id}`} className="btn btn-success btn-sm mx-1"><i
              class="fa-solid fa-pen-to-square"></i> Edit</Link>
            <input type="button" onClick={(e)=> deleteProduct(e, input.id)} value="X Delete" className='btn btn-danger
            btn-sm'/>

          </div>
        </div>

        <div className="row p-3 ">
          <div className="col-md-7">
            {input.property_image ? (
            <img src={`${PUBLIC_URL}/img_DB/ManageHotels/${input.property_image}`} alt={input.property_name}
              width="100%" height="400" />
            ) : (
            "No Image"
            )}
          </div>
          <div className="col-md-5">
            <h2 className="font-weight-bold mb-3">Property Information</h2>

            <h5>Property Name: {input.property_name}</h5>
            <h5>Cost Per Night: {input.cost_per_night} Taka</h5>
            <h5>Number of Available Rooms: {input.number_of_available_rooms} Rooms</h5>
            <h5>Average Rating: {input.Average_rating} Star</h5>
            <h5>Address: {input.address}</h5>


            {/* Social Media Sharing Buttons */}
           <div className="mt-5">
           <h5>Share Property Details:</h5>
            <div className="social-sharing" style={{ display: 'flex' , justifyContent: 'space-evenly' }}>
              <FacebookShareButton url={shareLink} style={{ backgroundColor: '#6bcae9' }}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <WhatsappShareButton url={shareLink} style={{ backgroundColor: '#6be980' }}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <TwitterShareButton url={shareLink} style={{ backgroundColor: '#6bcae9' }}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
           </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  </>;
};

export default PropertyDetails;
