import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostAstrology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    astrologer_type: "", address: "", state: "", city: "", 
    description: "", price: "", language_specific: false, 
    contact_form: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL 
      ? `${import.meta.env.VITE_BACKEND_URL}/api/astrologyads` 
      : "http://127.0.0.1:8000/api/astrologyads";
      
    // Assuming user might be logged in, we attach token if we had one
    // But for a generic setup we just POST it.
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({...formData, language_specific: formData.language_specific ? 1 : 0})
    })
    .then(res => {
      if(res.ok) navigate('/services/astrologyAds/postConfirmation');
      else alert("Failed to post ad.");
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Post Astrology Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-gray-700">Type</label>
             <select name="astrologer_type" required onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 bg-gray-50 border">
                <option value="">Select Type</option>
                <option value="Vedic">Vedic</option>
                <option value="Western">Western</option>
                <option value="Numerology">Numerology</option>
                <option value="Tarot">Tarot Reading</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Price ($)</label>
             <input type="number" name="price" required onChange={handleChange} placeholder="e.g. 100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 bg-gray-50 border" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3"><label className="block text-sm font-medium text-gray-700">Address</label><input type="text" name="address" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700">City</label><input type="text" name="city" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
          <div><label className="block text-sm font-medium text-gray-700">State</label><input type="text" name="state" required onChange={handleChange} className="mt-1 block w-full border rounded-md p-3 bg-gray-50" /></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea rows="4" name="description" required onChange={handleChange} className="mt-1 block w-full rounded-md border p-3 bg-gray-50"></textarea>
        </div>
        <button type="submit" className="w-full py-4 px-6 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-lg font-bold transition">Post Ad Now</button>
      </form>
    </div>
  );
}
