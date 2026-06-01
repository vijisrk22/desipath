import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { BASE_URL } from '../../utils/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { BUY_SELL_CATEGORIES, BUY_SELL_CONDITIONS } from '../../constants/buySellItemCategories';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';

const BuySellItemPortal = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    condition: '',
    description: ''
  });

  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchItem = async () => {
        try {
          const response = await api.get(`/api/buy-sell-items/${id}`);
          const item = response.data;
          setFormData({
            title: item.title || '',
            category: item.category || '',
            price: item.price || '',
            condition: item.condition || '',
            description: item.description || ''
          });
          const locStr = [item.city, item.zipcode].filter(Boolean).join(', ');
          setValue('location', locStr);
          setExistingImages(item.pictures || []);
        } catch (error) {
          toast.error("Failed to fetch item details.");
          navigate('/buy-sell-items');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrentImages = images.length + existingImages.length;
    if (totalCurrentImages + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setImages(prev => [...prev, ...files.slice(0, 5 - totalCurrentImages)]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setExistingImages(prev => prev.filter(img => img !== url));
    setRemovedImages(prev => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
      }
    });

    let city = '';
    let zipcode = '';
    if (locationValue) {
        const parts = locationValue.split(',').map(p => p.trim());
        if (parts.length >= 3) {
           city = parts[0];
           zipcode = parts[parts.length - 1];
        } else {
           const lastPart = parts[parts.length - 1];
           if (/\d/.test(lastPart)) zipcode = lastPart;
           else city = parts[0];
        }
    }
    
    if (city) data.append('city', city);
    if (zipcode) data.append('zipcode', zipcode);

    images.forEach(image => {
      data.append('images[]', image);
    });

    if (isEditing) {
      data.append('removed_images', JSON.stringify(removedImages));
      data.append('_method', 'PUT'); // Laravel requires this for multipart PUT
    }

    try {
      if (isEditing) {
        await api.post(`/api/buy-sell-items/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Item updated successfully!");
        navigate(`/buy-sell-items/details/${id}`);
      } else {
        await api.post(`/api/buy-sell-items`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Item posted successfully!");
        navigate('/buy-sell-items/success');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-10 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center">
          <Link to="/" className="hover:text-[#0857d0] hover:underline font-medium">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link to="/buy-sell-items" className="hover:text-[#0857d0] hover:underline font-medium">Buy/Sell Items</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-semibold">{isEditing ? 'Edit Ad' : 'Post Ad'}</span>
        </div>
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0857d0] to-indigo-700 text-white p-8">
            <h1 className="text-3xl font-extrabold">{isEditing ? 'Edit Your Ad' : 'Post an Item for Sale'}</h1>
            <p className="opacity-90 mt-2 text-lg">Fill out the details below to list your item.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                 <svg className="w-6 h-6 mr-2 text-[#0857d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Item Details
              </h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  name="title"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0] transition-colors bg-gray-50 focus:bg-white px-4 py-2.5"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select 
                    required
                    name="category"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0] transition-colors bg-gray-50 focus:bg-white px-4 py-2.5"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {BUY_SELL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Condition</label>
                  <select 
                    name="condition"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0] transition-colors bg-gray-50 focus:bg-white px-4 py-2.5"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <option value="">Select condition</option>
                    {BUY_SELL_CONDITIONS.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Price ($)</label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  min="0"
                  className="w-full md:w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0] transition-colors bg-gray-50 focus:bg-white px-4 py-2.5"
                  placeholder="e.g. 50.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                <textarea 
                  name="description"
                  rows="5"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0] transition-colors bg-gray-50 focus:bg-white px-4 py-2.5"
                  placeholder="Describe your item in detail..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="space-y-5 pt-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                 <svg className="w-6 h-6 mr-2 text-[#0857d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 Location
              </h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">City & Zipcode <span className="text-red-500">*</span></label>
                <div className="bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-[#0857d0] focus-within:border-[#0857d0]">
                  <LocationAutocompleteInput 
                    control={control} 
                    setValue={setValue}
                    type="search"
                    placeholder="Search city or zipcode..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                 <svg className="w-6 h-6 mr-2 text-[#0857d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 Photos (Up to 5)
              </h2>
              <div className="flex flex-wrap gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed">
                {existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md group">
                    <img src={url.startsWith('http') ? url : `${BASE_URL}${url}`} alt="existing" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(url)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">×</span>
                    </button>
                  </div>
                ))}
                
                {images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md group">
                    <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">×</span>
                    </button>
                  </div>
                ))}

                {(images.length + existingImages.length) < 5 && (
                  <label className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-[#0857d0] text-[#0857d0] rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-sm font-bold">Add Photo</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full text-lg font-bold py-4 px-6 rounded-xl text-white shadow-xl transition-all duration-300 ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#0857d0] to-indigo-600 hover:shadow-2xl hover:-translate-y-1'}`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : (isEditing ? 'Update Ad' : 'Post Ad')}
              </button>
            </div>

          </form>
        </div>
      </div>
      </div>
      <Footer newsletter={"block"} />
    </div>
  );
};

export default BuySellItemPortal;
