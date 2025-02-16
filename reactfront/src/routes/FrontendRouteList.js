/** 4 */
import Page404 from "../components/Error/Page404";
import CreateHotel from "../components/frontend/CreateHotel/CreateHotel";
import EditHotel from "../components/frontend/EditHotel/EditHotel";
import Home from "../components/frontend/Home/Home";
import PropertyDetails from "../components/frontend/PropertyDetails/PropertyDetails";




const FrontendRouteList =
[
    // Pages
    { path:'/', exact:true, name:'Home' , component:Home },
    { path:'/create-hotel', exact:true, name:'CreateHotel', component:CreateHotel },
    { path:'/property-details/:id', exact:true, name:'PropertyDetails', component:PropertyDetails },
    { path:'/property-details/edit-hotel/:id', exact:true, name:'EditHotel', component:EditHotel },
    

    { path:'*', exact:true, name:'Page404' , component:Page404 },
];

export default FrontendRouteList;
