import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { 
  CircularProgress, 
  Button, 
  TextField, 
  MenuItem, 
  IconButton, 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  Autocomplete
} from "@mui/material";
import { PHOTOGRAPHY_SERVICES } from "../../constants/photographyServices";

export default function PhotographyPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    service_type: "Photographer",
    experience_years: "",
    languages: "English",
    video_url: "",
    services: {}, // { "Photography Services": ["Wedding Photography"], ... }
    packages: [{ name: "", price: "", description: "" }],
    locations: [{ address: "", city: "", state: "", zipcode: "" }],
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [backdropPhoto, setBackdropPhoto] = useState(null);

  const [locOptions, setLocOptions] = useState([]);
  const [locInput, setLocInput] = useState("");

  // Fetch locations for autocomplete
  useEffect(() => {
    if (locInput.length < 2) {
      setLocOptions([]);
      return;
    }
    const fetchLocs = async () => {
      try {
        const res = await api.get(`/api/location/locations?filter=${locInput}`);
        setLocOptions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const t = setTimeout(fetchLocs, 300);
    return () => clearTimeout(t);
  }, [locInput]);

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const res = await api.get(`/api/photography/details/${id}`);
          if (res.data.success) {
            const d = res.data.data;
            setFormData({
              title: d.title,
              bio: d.bio,
              service_type: d.service_type,
              experience_years: d.experience_years,
              languages: d.languages,
              services: d.services || {},
              video_url: d.video_url || "",
              packages: d.packages?.length > 0 ? d.packages : [{ name: "", price: "", description: "" }],
              locations: d.locations?.length > 0 ? d.locations : [{ address: "", city: "", state: "", zipcode: "" }],
            });
          }
        } catch (err) {
          console.error("Fetch failed", err);
        } finally {
          setFetching(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (category, service) => {
    const currentServices = { ...formData.services };
    if (!currentServices[category]) {
      currentServices[category] = [];
    }

    if (currentServices[category].includes(service)) {
      currentServices[category] = currentServices[category].filter(s => s !== service);
    } else {
      currentServices[category].push(service);
    }

    setFormData({ ...formData, services: currentServices });
  };

  const handlePackageChange = (index, field, value) => {
    const newPkgs = [...formData.packages];
    newPkgs[index][field] = value;
    setFormData({ ...formData, packages: newPkgs });
  };

  const addPackage = () => {
    setFormData({ ...formData, packages: [...formData.packages, { name: "", price: "", description: "" }] });
  };

  const handleLocationChange = (index, field, value) => {
    const newLocs = [...formData.locations];
    newLocs[index][field] = value;
    setFormData({ ...formData, locations: newLocs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("bio", formData.bio);
    data.append("service_type", formData.service_type);
    data.append("experience_years", formData.experience_years);
    data.append("languages", formData.languages);
    data.append("video_url", formData.video_url);
    
    // Services need to be stringified for FormData if sending as array/object
    data.append("services", JSON.stringify(formData.services));

    formData.packages.forEach((pkg, i) => {
      data.append(`packages[${i}][name]`, pkg.name);
      data.append(`packages[${i}][price]`, pkg.price);
      data.append(`packages[${i}][description]`, pkg.description);
    });

    formData.locations.forEach((loc, i) => {
      data.append(`locations[${i}][city]`, loc.city);
      data.append(`locations[${i}][state]`, loc.state);
      data.append(`locations[${i}][zipcode]`, loc.zipcode);
      if (loc.address) data.append(`locations[${i}][address]`, loc.address);
    });

    if (profilePhoto) data.append("profile_photo", profilePhoto);
    if (backdropPhoto) data.append("backdrop_photo", backdropPhoto);

    try {
      const url = id ? `/api/photography/update/${id}` : "/api/photography/store";
      const res = await api.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        navigate("/services/photography/success");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save listing. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><CircularProgress /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex-grow py-12 px-[7%]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 overflow-hidden">
            <div className="bg-[#007185] p-10 text-white">
              <h1 className="text-3xl font-black font-dmsans">
                {id ? "Edit Photography Profile" : "Become a Featured Photographer"}
              </h1>
              <p className="mt-2 text-blue-100 font-medium">Showcase your talent and connect with clients looking for quality media services.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              {/* Basic Info */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Business/Professional Name"
                    name="title"
                    fullWidth
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    select
                    label="Service Type"
                    name="service_type"
                    fullWidth
                    value={formData.service_type}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Photographer">Photographer Only</MenuItem>
                    <MenuItem value="Videographer">Videographer Only</MenuItem>
                    <MenuItem value="Both">Both (Hybrid)</MenuItem>
                  </TextField>
                  <TextField
                    label="Years of Experience"
                    name="experience_years"
                    type="number"
                    fullWidth
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Languages Spoken"
                    name="languages"
                    placeholder="e.g. English, Spanish"
                    fullWidth
                    value={formData.languages}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-6">
                  <TextField
                    label="Professional Bio"
                    name="bio"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell clients about your style, equipment, and passion..."
                  />
                </div>
              </section>

              {/* Service Categories Section */}
              <section className="bg-slate-50 -mx-10 p-10">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(PHOTOGRAPHY_SERVICES).map(([category, services]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-bold text-[#007185] border-b pb-2">{category}</h3>
                      <FormGroup>
                        {services.map(service => (
                          <FormControlLabel
                            key={service}
                            control={
                              <Checkbox 
                                size="small"
                                checked={formData.services[category]?.includes(service) || false}
                                onChange={() => handleServiceToggle(category, service)}
                              />
                            }
                            label={<span className="text-sm text-gray-700">{service}</span>}
                          />
                        ))}
                      </FormGroup>
                    </div>
                  ))}
                </div>
              </section>

              {/* Media Section */}
              <section className="p-0">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">3</span>
                  Visual Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Profile Photo (Headshot)</label>
                      <input 
                        type="file" 
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        className="p-3 bg-white border border-gray-200 rounded-xl w-full"
                        accept="image/*"
                      />
                   </div>
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Backdrop / Portfolio Cover</label>
                      <input 
                        type="file" 
                        onChange={(e) => setBackdropPhoto(e.target.files[0])}
                        className="p-3 bg-white border border-gray-200 rounded-xl w-full"
                        accept="image/*"
                      />
                   </div>
                </div>
                <div className="mt-8">
                  <TextField
                    label="Video Showreel URL (YouTube/Vimeo)"
                    name="video_url"
                    fullWidth
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </section>

              {/* Pricing Packages */}
              <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">4</span>
                    Pricing Packages
                    </h2>
                    <Button onClick={addPackage} variant="outlined" size="small" sx={{ borderRadius: 57 }}>+ Add Package</Button>
                </div>
                
                <div className="space-y-6">
                  {formData.packages.map((pkg, idx) => (
                    <div key={idx} className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm relative group">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <TextField
                            label="Package Name"
                            value={pkg.name}
                            onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                            required
                            className="md:col-span-2"
                          />
                          <TextField
                            label="Price ($)"
                            type="number"
                            value={pkg.price}
                            onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                            required
                          />
                          <TextField
                            label="What's included?"
                            multiline
                            rows={2}
                            fullWidth
                            value={pkg.description}
                            onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                            className="md:col-span-3"
                          />
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Service Locations */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">5</span>
                  Primary Service Area
                </h2>

                <div className="mb-6">
                   <Autocomplete
                    fullWidth
                    options={locOptions}
                    getOptionLabel={(option) => option.city ? `${option.city}, ${option.state_id} ${option.zip}` : ""}
                    filterOptions={(x) => x}
                    onInputChange={(e, val) => setLocInput(val)}
                    onChange={(e, val) => {
                      if (val) {
                        const newLocs = [...formData.locations];
                        newLocs[0] = {
                          ...newLocs[0],
                          city: val.city,
                          state: val.state_id,
                          zipcode: val.zip
                        };
                        setFormData({ ...formData, locations: newLocs });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Search City, State or Zip" 
                        helperText="Search and select to auto-fill location details"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <TextField
                     label="City"
                     value={formData.locations[0].city}
                     onChange={(e) => handleLocationChange(0, 'city', e.target.value)}
                     required
                   />
                   <TextField
                     label="State"
                     value={formData.locations[0].state}
                     onChange={(e) => handleLocationChange(0, 'state', e.target.value)}
                     required
                   />
                   <TextField
                     label="Zipcode"
                     value={formData.locations[0].zipcode}
                     onChange={(e) => handleLocationChange(0, 'zipcode', e.target.value)}
                     required
                   />
                </div>
                <p className="mt-4 text-xs text-gray-400 font-medium">
                  Note: Clients within a 100-mile radius of this zip code will be able to find you in search results.
                </p>
              </section>

              <div className="pt-10 flex gap-4">
                 <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    disabled={loading}
                    sx={{ 
                      borderRadius: 57, 
                      px: 8, 
                      py: 2, 
                      backgroundColor: '#007185',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#005b6a' }
                    }}
                 >
                   {loading ? <CircularProgress size={24} color="inherit" /> : id ? "Update Profile" : "Publish Profile"}
                 </Button>
                 <Button 
                    onClick={() => navigate(-1)}
                    variant="text" 
                    sx={{ borderRadius: 57, px: 4, fontWeight: 'bold', color: 'gray' }}
                 >
                   Cancel
                 </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
