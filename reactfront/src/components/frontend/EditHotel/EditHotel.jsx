import { React, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import { PUBLIC_URL } from "../../../PUBLIC_URL";



const EditHotel = () => {
  const history = useHistory();
  const { id } = useParams();

  document.title = "Edit Hotel";
  
  const [loading, setLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false); // 🔹 Add button loading state
  const [errorlist, setError] = useState([]);
  const [picture, setPicture] = useState([]);
  const [input, setInput] = useState({
    property_name: '',
    cost_per_night: '',
    number_of_available_rooms: '',
    Average_rating: '',
    address: '',
  });

  const handleInput = (e) => {
      e.persist();
      setInput({ ...input, [e.target.name]: e.target.value });
  }
  const handleImage = (e) => {
      setPicture({ property_image: e.target.files[0] });
  }


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


  const formSubmit = (e) => {
    e.preventDefault();

    // Btn Start loading
    setIsLoadingBtn(true); 

    // Debugging
    console.log("Submitting ID:", id); 

    const formData = new FormData();
    if(picture.property_image){
      formData.append('property_image', picture.property_image);  
    }
    formData.append('property_name', input.property_name);
    formData.append('cost_per_night', input.cost_per_night);
    formData.append('number_of_available_rooms', input.number_of_available_rooms);
    formData.append('Average_rating', input.Average_rating);
    formData.append('address', input.address);

    // Debugging: Log formData content
    console.log("Form Data Entries:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    // Post request
    axios.post(`/api/update-hotel/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res => {
      setIsLoadingBtn(false);
      if (res.data.status === 200) {
          swal("Success", "Hotel updated successfully", "success");
          setError([]);
          history.push('/'); 
      } 
      else if (res.data.status === 422) { // validator fails
          swal("All Fields Are Mandetory", "", "error");
          setError(res.data.errors);
          console.log(res.data.message)
      }
      else if (res.data.status === 404) { // No Product Id Found
          swal("Error", res.data.message, "error");
          console.log(res.data.message)
      } 
      else {
          setError(res.data.errors || []);  // Handle validation errors
          swal("Error", "Failed to update hotel", "error");
          console.log(res.data.message)
      }
  }) 
  // .catch(err => {
  //     setIsLoadingBtn(false);
  //     swal("Error", "Something went wrong.", "error");
  // });
};


// Loading state
if (loading) {
return <>
<div className="container">
    <h1 className="text-center mt-5">Loading Hotel...</h1>
</div>
</>;
    }
  
return (
<>
  <div style={{ backgroundColor:'wheat' }}>
    <div className="container">
    {input.property_image ? (
    <img src={`${PUBLIC_URL}/img_DB/ManageHotels/${input.property_image}`} alt={input.property_name} width="100%" height="400" />                      
    ) : (
     "No Image"
    )}

      <form encType="multipart/form-data" onSubmit={formSubmit}>
        <h3 className="mb-5">Edit Hotel</h3>

        <div class="row mb-4">
          <div class="col">
            <label> Property Name </label>
            <input type="text" name='property_name' value={input.property_name} onChange={handleInput} class="form-control" />
            <span className="text-danger">{errorlist.property_name}</span>
          </div>
          <div class="col">
            <label> Cost Per Night </label>
            <input type="number" name='cost_per_night' value={input.cost_per_night} onChange={handleInput} class="form-control" />
            <span className="text-danger">{errorlist.cost_per_night}</span>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <label> Number Of Available Rooms </label>
            <input type="number" name='number_of_available_rooms' value={input.number_of_available_rooms} onChange={handleInput} class="form-control" />
            <span className="text-danger">{errorlist.number_of_available_rooms}</span>
          </div>
          <div class="col">
            <label> Average Rating </label>
            <input type="number" name='Average_rating' value={input.Average_rating} onChange={handleInput} class="form-control" />
            <span className="text-danger">{errorlist.Average_rating}</span>
          </div>
        </div>


        <div class="mb-4">
          <label> Address </label>
          <textarea name='address' value={input.address} onChange={handleInput} class="form-control" rows="4"></textarea>
          <span className="text-danger">{errorlist.address}</span>
        </div>

        <div class="mb-4">
          <label> Property Image </label>
          <div className="mb-3">
          {input.property_image ? (
          <img src={`${PUBLIC_URL}/img_DB/ManageHotels/${input.property_image}`} alt={input.property_name}
                                  width="150px" height="80px" />
          ) : (
          "No Image"
          )}
          </div>
          <input type="file" accept="image/*" onChange={handleImage} name='property_image'  className='form-control' />

          <span className="text-danger">{errorlist.property_image}</span>
        </div>


        <button type="submit" class="btn linkbtn text-white" style={{ width: "100%" }} disabled={isLoadingBtn}>
                {isLoadingBtn ? "Please Wait, Updating..." : "Update"}
        </button>
      </form>
    </div>
  </div>
</>
);
};

export default EditHotel;