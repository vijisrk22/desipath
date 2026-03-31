import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function PostClass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", address: "", state: "", city: "", 
    description: "", price: "", 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
      
    api.post('/api/classesforkidsads', formData)
    .then(res => {
      if(res.status === 201 || res.status === 200) navigate('/services/classesForKids/postConfirmation');
      else alert("Failed to post class.");
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Post a Class For Kids</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700">Class Title</label><input type="text" name="title" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Price ($)</label><input type="number" name="price" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3"><label className="block text-sm font-medium text-gray-700">Address</label><input type="text" name="address" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700">City</label><input type="text" name="city" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700">State</label><input type="text" name="state" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea rows="4" name="description" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50"></textarea>
        </div>
        <button type="submit" className="w-full py-4 px-6 bg-green-600 text-white rounded-md shadow hover:bg-green-700 text-lg font-bold transition">Post Class</button>
      </form>
    </div>
  );
}
