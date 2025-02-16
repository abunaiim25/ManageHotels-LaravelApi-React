import { React, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';



const EditHotel = () => {
  const history = useHistory();

  document.title = "Create Hotel";
  
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


  const formSubmit = (e) => {
    e.preventDefault();

    // Btn Start loading
    setIsLoadingBtn(true); 

    const formData = new FormData();
    formData.append('property_image', picture.property_image);  
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
    axios.post(`/api/store-hotel`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res => {
        setIsLoadingBtn(false);
        if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            setError([]);
            history.push('/');
        } else if (res.data.status === 422) {
            swal("All Fields Are Mandatory", "", "error");
            setError(res.data.errors);
        }
    }).catch(err => {
        swal("Error", "Something went wrong!", "error");
        console.error("Axios Error:", err);
    });
};



  
return (
<>
  <div style={{ backgroundColor:'wheat' }}>
    <div className="container">
      <img className="mt-3" src="assets/image/hotel.jpg" height="300px" width="100%" />

      <form encType="multipart/form-data" onSubmit={formSubmit}>
        <h3 className="mb-5">Create Hotel</h3>

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
          <input type="file" accept="image/*" onChange={handleImage} name='property_image'  className='form-control' />
          <span className="text-danger">{errorlist.property_image}</span>
        </div>


        <button type="submit" class="btn linkbtn text-white" style={{ width: "100%" }} disabled={isLoadingBtn}>
                {isLoadingBtn ? "Please Wait, Storing..." : "Store"}
        </button>
      </form>
    </div>
  </div>
</>
);
};

export default EditHotel;