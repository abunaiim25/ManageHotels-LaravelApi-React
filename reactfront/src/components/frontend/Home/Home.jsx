import { Link  } from "react-router-dom";
import { React, useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { PUBLIC_URL } from "../../../PUBLIC_URL";

const Home = () => {
  document.title = "Manage Hotels";

  
  const [loading, setLoading] = useState(true);
  const [viewHotel, setHotel] = useState([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);


  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true); // Show loading indicator while fetching data
      try {
        const res = await axios.get(`/api/view-hotels?page=${currentPage}`);
        if (res.data.status === 200) {
          setHotel(res.data.hotel.data);
          setCurrentPage(res.data.hotel.current_page);
          setLastPage(res.data.hotel.last_page);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [currentPage]); // Runs whenever `currentPage` changes



  //Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }


  };
  return <>
  <div>
    <div className="hero" style={{ backgroundImage: `url('assets/image/hotel2.jpg')`, backgroundSize: 'cover' ,
      backgroundPosition: 'center' , height: '50vh' }}></div>
    <div className="container">
      <h3 className='mt-5' style={{ fontWeight:600 }}>Manage Hotels</h3>

      <div className="card p-4 m-4">
        <div className='d-flex justify-content-between'>
          <h4 style={{ color:'black', fontWeight:'600' }}>Property Cards</h4>

          <div>
            {!localStorage.getItem('auth_token') ? (
            <Link className="linkbtn btn text-white" to="/login">Login to Continue Create Hotel</Link>
            ) : (
            <Link className="linkbtn btn text-white" to="/create-hotel">+ Create Hotel</Link>
            )}
          </div>
        </div>

        <div>
          {loading ? (
          <h1 className="text-center p-5">Loading Hotel...</h1> // Show loading message
          ) : (
          viewHotel.length > 0 ? (
          <>
            <div className="row mt-4">
              {viewHotel.map((item) => (
              <div className="col-md-6 mb-4">
                <Link to={`property-details/${item.id}`}>
                <div className="card p-3 card_item">
                  {item.property_image ? (
                  <img src={`${PUBLIC_URL}/img_DB/ManageHotels/${item.property_image}`} alt={item.property_name}
                    width="100%" height="200" />
                  ) : (
                  "No Image"
                  )}
                  <h4 className="text-center card_title">{item.property_name}</h4>
                  <h6 className="text-center text-muted">{item.address}</h6>
                </div>
                </Link>
              </div>
              ))}
            </div>


            {/* Pagination */}
            <div className="d-flex flex-row-reverse bd-highlight">
              <nav className="mt-4">
                <ul className="pagination d-flex">
                  <li className={`page-item ${currentPage===1 ? "disabled" : "" }`}>
                    <button className="page-link" onClick={()=> handlePageChange(currentPage - 1)}>
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: lastPage }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage===index + 1 ? "active" : "" }`}>
                    <button className="page-link" onClick={()=> handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                  ))}

                  <li className={`page-item ${currentPage===lastPage ? "disabled" : "" }`}>
                    <button className="page-link" onClick={()=> handlePageChange(currentPage + 1)}>
                      Next.
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
          ) : (
          <p>No hotels available.</p>
          )
          )}
        </div>
      </div>
    </div>
  </div>
  </>;
};

export default Home;
