import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function PostPhotographyForm() {
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
    album_url: "",
    video_url: "",
    video_url_2: "",
    video_url_3: "",
    open_to_travel: false,
    travel_policy: "Travel Expenses to be paid",
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
              album_url: d.album_url || "",
              video_url: d.video_url || "",
              video_url_2: d.video_url_2 || "",
              video_url_3: d.video_url_3 || "",
              open_to_travel: !!d.open_to_travel,
              travel_policy: d.travel_policy || "Travel Expenses to be paid",
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
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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

  const addLocation = () => {
    setFormData({ ...formData, locations: [...formData.locations, { address: "", city: "", state: "", zipcode: "" }] });
  };

  const removeLocation = (index) => {
    if (formData.locations.length === 1) return;
    const newLocs = formData.locations.filter((_, i) => i !== index);
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
    data.append("album_url", formData.album_url);
    data.append("video_url", formData.video_url);
    data.append("video_url_2", formData.video_url_2);
    data.append("video_url_3", formData.video_url_3);
    data.append("open_to_travel", formData.open_to_travel);
    data.append("travel_policy", formData.travel_policy);
    
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

  if (fetching) return <div className="flex items-center justify-center py-20"><CircularProgress /></div>;

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4 shadow-sm mx-auto mb-10">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full space-y-8 py-6">
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-bold text-[#007185] mb-4 flex items-center gap-2 font-dmsans">
            <span className="w-7 h-7 bg-[#007185]/10 text-[#007185] rounded-full flex items-center justify-center text-xs">1</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField
              label="Business/Professional Name"
              name="title"
              fullWidth
              size="small"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              select
              label="Service Type"
              name="service_type"
              fullWidth
              size="small"
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
              size="small"
              value={formData.experience_years}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Languages Spoken"
              name="languages"
              placeholder="e.g. English, Spanish"
              fullWidth
              size="small"
              value={formData.languages}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-5">
            <TextField
              label="Professional Bio"
              name="bio"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={formData.bio}
              onChange={handleInputChange}
              required
              placeholder="Tell clients about your style, equipment, and passion..."
            />
          </div>
          <div className="mt-5 p-4 bg-[#007185]/5 rounded-xl border border-[#007185]/10">
              <FormControlLabel
                  control={
                      <Checkbox 
                          name="open_to_travel"
                          checked={formData.open_to_travel}
                          onChange={handleInputChange}
                          size="small"
                          sx={{ color: '#007185', '&.Mui-checked': { color: '#007185' } }}
                      />
                  }
                  label={
                      <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm font-dmsans">Open to Travel</span>
                          <span className="text-[11px] text-gray-500">Willing to travel for assignments outside primary service area.</span>
                      </div>
                  }
              />
              {formData.open_to_travel && (
                  <div className="mt-3">
                       <TextField
                          label="Travel Policy"
                          name="travel_policy"
                          fullWidth
                          size="small"
                          value={formData.travel_policy}
                          onChange={handleInputChange}
                          placeholder="e.g. Travel Expenses to be paid"
                          sx={{ backgroundColor: 'white' }}
                       />
                  </div>
              )}
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-lg font-bold text-[#007185] mb-4 flex items-center gap-2 font-dmsans">
            <span className="w-7 h-7 bg-[#007185]/10 text-[#007185] rounded-full flex items-center justify-center text-xs">2</span>
            Services Offered
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-gray-100">
            {Object.entries(PHOTOGRAPHY_SERVICES).map(([category, services]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider border-b pb-1 mb-2">{category}</h3>
                <FormGroup>
                  {services.map(service => (
                    <FormControlLabel
                      key={service}
                      control={
                        <Checkbox 
                          size="small"
                          checked={formData.services[category]?.includes(service) || false}
                          onChange={() => handleServiceToggle(category, service)}
                          sx={{ color: '#007185', '&.Mui-checked': { color: '#007185' } }}
                        />
                      }
                      label={<span className="text-[13px] text-gray-600 font-medium">{service}</span>}
                    />
                  ))}
                </FormGroup>
              </div>
            ))}
          </div>
        </section>

        {/* Media */}
        <section>
          <h2 className="text-lg font-bold text-[#007185] mb-4 flex items-center gap-2 font-dmsans">
            <span className="w-7 h-7 bg-[#007185]/10 text-[#007185] rounded-full flex items-center justify-center text-xs">3</span>
            Media & Visuals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profile Photo (Headshot)</label>
                <input 
                  type="file" 
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className="text-sm p-2 bg-gray-50 border border-gray-100 rounded-lg w-full cursor-pointer"
                  accept="image/*"
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Backdrop / Portfolio Cover</label>
                <input 
                  type="file" 
                  onChange={(e) => setBackdropPhoto(e.target.files[0])}
                  className="text-sm p-2 bg-gray-50 border border-gray-100 rounded-lg w-full cursor-pointer"
                  accept="image/*"
                />
             </div>
          </div>
          <div className="mt-5 space-y-4">
            <TextField
              label="Photography Album Website URL"
              name="album_url"
              fullWidth
              size="small"
              value={formData.album_url}
              onChange={handleInputChange}
              placeholder="https://your-portfolio.com or https://flickr.com/..."
            />
            <TextField
              label="Video Showreel URL 1 (YouTube/Vimeo)"
              name="video_url"
              fullWidth
              size="small"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <TextField
              label="Video Showreel URL 2 (YouTube/Vimeo)"
              name="video_url_2"
              fullWidth
              size="small"
              value={formData.video_url_2}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <TextField
              label="Video Showreel URL 3 (YouTube/Vimeo)"
              name="video_url_3"
              fullWidth
              size="small"
              value={formData.video_url_3}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </section>

        {/* Packages */}
        <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#007185] flex items-center gap-2 font-dmsans">
              <span className="w-7 h-7 bg-[#007185]/10 text-[#007185] rounded-full flex items-center justify-center text-xs">4</span>
              Pricing Packages
              </h2>
              <Button 
                onClick={addPackage} 
                size="small" 
                sx={{ 
                    borderRadius: 57, 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    color: '#ffa41c',
                    borderColor: '#ffa41c',
                    '&:hover': { borderColor: '#e8931a', backgroundColor: '#ffa41c0a' }
                }} 
                variant="outlined"
              >
                + Add Package
              </Button>
          </div>
          
          <div className="space-y-4">
            {formData.packages.map((pkg, idx) => (
              <div key={idx} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm relative group">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                      label="Package Name"
                      value={pkg.name}
                      onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                      required
                      size="small"
                      className="md:col-span-2"
                    />
                    <TextField
                      label="Price ($)"
                      type="number"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                      required
                      size="small"
                    />
                    <TextField
                      label="What's included?"
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                      className="md:col-span-3"
                    />
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#007185] flex items-center gap-2 font-dmsans">
              <span className="w-7 h-7 bg-[#007185]/10 text-[#007185] rounded-full flex items-center justify-center text-xs">5</span>
              Service Areas
              </h2>
              <Button 
                onClick={addLocation} 
                size="small" 
                sx={{ 
                    borderRadius: 57, 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    color: '#ffa41c',
                    borderColor: '#ffa41c',
                    '&:hover': { borderColor: '#e8931a', backgroundColor: '#ffa41c0a' }
                }} 
                variant="outlined"
              >
                + Add Another Area
              </Button>
          </div>
          
          <div className="space-y-5">
              {formData.locations.map((loc, idx) => (
                  <div key={idx} className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 relative">
                      {formData.locations.length > 1 && (
                          <IconButton 
                              onClick={() => removeLocation(idx)}
                              sx={{ position: 'absolute', top: 8, right: 8, color: 'red', '&:hover': { backgroundColor: '#fee2e2' } }}
                              size="small"
                          >
                              ✕
                          </IconButton>
                      )}
                      
                      <div className="mb-4">
                         <Autocomplete
                          fullWidth
                          size="small"
                          options={locOptions}
                          getOptionLabel={(option) => option.city ? `${option.city}, ${option.state_id} ${option.zip}` : ""}
                          filterOptions={(x) => x}
                          onInputChange={(e, val) => setLocInput(val)}
                          onChange={(e, val) => {
                            if (val) {
                              handleLocationChange(idx, 'city', val.city);
                              handleLocationChange(idx, 'state', val.state_id);
                              handleLocationChange(idx, 'zipcode', val.zip);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label={`Search Area ${idx + 1}`} 
                              sx={{ backgroundColor: 'white' }}
                            />
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <TextField
                           label="City"
                           value={loc.city}
                           onChange={(e) => handleLocationChange(idx, 'city', e.target.value)}
                           required
                           size="small"
                           sx={{ backgroundColor: 'white' }}
                         />
                         <TextField
                           label="State"
                           value={loc.state}
                           onChange={(e) => handleLocationChange(idx, 'state', e.target.value)}
                           required
                           size="small"
                           sx={{ backgroundColor: 'white' }}
                         />
                         <TextField
                           label="Zipcode"
                           value={loc.zipcode}
                           onChange={(e) => handleLocationChange(idx, 'zipcode', e.target.value)}
                           required
                           size="small"
                           sx={{ backgroundColor: 'white' }}
                         />
                      </div>
                  </div>
              ))}
          </div>
        </section>

        <div className="pt-6">
           <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#ffa41c] hover:bg-[#e8931a] text-gray-800 text-xl font-bold font-dmsans rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
           >
             {loading ? <CircularProgress size={24} color="inherit" /> : id ? "Update Photography Profile" : "Review & Publish Profile"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default PostPhotographyForm;
