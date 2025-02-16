<?php
namespace App\Http\Controllers\API;

use App\Models\ManageHotels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
//for delete image

class ManageHotelsController extends Controller
{
    //=================Store on DB========================
    public function store(Request $request)
    {
        //validation
        $validator = Validator::make($request->all(), [
            'property_name'             => 'required|string|max:255',
            'address'                   => 'required|string|max:255',
            'cost_per_night'            => 'required|numeric',
            'number_of_available_rooms' => 'required|numeric',
            'Average_rating'            => 'required|numeric',
            'property_image'            => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        //post fail or post Database
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {
            $data = new ManageHotels();

            $data->property_name             = $request->input('property_name');
            $data->address                   = $request->input('address');
            $data->cost_per_night            = $request->input('cost_per_night');
            $data->number_of_available_rooms = $request->input('number_of_available_rooms');
            $data->Average_rating            = $request->input('Average_rating|in:5');

            if ($request->hasFile('property_image')) {
                $file     = $request->file('property_image');
                $ext      = $file->getClientOriginalExtension();
                $filename = time() . '.' . $ext;
                $file->move('img_DB/ManageHotels/', $filename);
                $data->property_image = $filename;
            }
            $data->save();

            return response()->json([
                'status'  => 200,
                'message' => 'Product Added Successfully',
            ]);
        }
    }

    //=================View Hotel========================
    public function view()
    {
        $hotel = ManageHotels::latest()->paginate(8); // Show 2 products per page
        return response()->json([
            'status' => 200,
            'hotel'  => $hotel,
        ]);
    }

    //=================Property Details========================
    public function property_details($id)
    {
        // Find product by ID and Slug
        $hotel = ManageHotels::where('id', $id)->first();

        if ($hotel) {
            return response()->json([
                'status' => 200,
                'hotel'  => $hotel,
            ]);
        } else {
            return response()->json([
                'status'  => 404,
                'message' => 'Property Details not found',
            ], 404);
        }
    }

    //=================Update Hotel========================
    public function update(Request $request, $id)
    {
        Log::info("Received ID: $id"); // ✅ Debugging

        //validation
        $validator = Validator::make($request->all(), [
            'property_name'             => 'required|string|max:255',
            'address'                   => 'required|string|max:255',
            'cost_per_night'            => 'required|numeric',
            'number_of_available_rooms' => 'required|numeric',
            'Average_rating'            => 'required|numeric',
            'property_image'            => $request->hasFile('property_image') ? 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048' : 'nullable',
        ]);

        //post fail or post Database
        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages(),
            ]);
        } else {
            $data = ManageHotels::where('id', $id)->first();
            if ($data) {
                $data->property_name             = $request->input('property_name');
                $data->address                   = $request->input('address');
                $data->cost_per_night            = $request->input('cost_per_night');
                $data->number_of_available_rooms = $request->input('number_of_available_rooms');
                $data->Average_rating            = $request->input('Average_rating');

                if ($request->hasFile('property_image')) {
                    // Check if the existing image exists and delete it
                    if (!empty($data->property_image)) {
                        $oldImagePath = public_path('img_DB/ManageHotels/' . $data->property_image);
                        if (File::exists($oldImagePath)) {
                            File::delete($oldImagePath);
                        }
                    }
                    // Upload the new image
                    $file = $request->file('property_image');
                    $ext = $file->getClientOriginalExtension();
                    $filename = time() . '.' . $ext;
                    $file->move(public_path('img_DB/ManageHotels/'), $filename);
                    // Save only the filename in the database
                    $data->property_image = $filename;
                }
                $data->update();

                return response()->json([
                    'status'  => 200,
                    'message' => 'Hotel Updated Successfully',
                ]);
            } else {
                Log::error("No Hotel found for ID: $id"); // ✅ Log error
                return response()->json([
                    'status'  => 404,
                    'message' => 'No Hotel Slug & Id Found',
                ]);
            }
        }
    }

         //================= destroy page by Id ========================
         public function destroy($id)
         {
             $data = ManageHotels::find($id);
             if ($data) {
                //image delete
                if (!empty($data->property_image)) {
                    $oldImagePath = public_path('img_DB/ManageHotels/' . $data->property_image);
                    if (File::exists($oldImagePath)) {
                        File::delete($oldImagePath);
                    }
                }
                 $data->delete();
    
                 return response()->json([
                     'status' => 200,
                     'message' => 'Hotel Deleted Successfully'
                 ]);
             }
             else
             {
                 return response()->json([
                     'status' => 404,
                     'message' => 'No Id Found'
                 ]);
             }
         }
}
