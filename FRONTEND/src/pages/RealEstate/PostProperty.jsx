import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Container,
  InputAdornment
} from '@mui/material';
import { CloudUpload, Home as HomeIcon, LocationOn, Person, Business } from '@mui/icons-material';

const COUNTRIES = ["India", "Dubai"];
const PROPERTY_TYPES = ["Apartment", "Villa", "Individual House"];
const FEATURES_OPTIONS = [
  "Swimming Pool", "Gym", "Private Garden", "Sea View", 
  "24/7 Security", "Parking", "Terrace", "Smart Home",
  "Home Theater", "Solar Power", "Beach Access", "Club House"
];

const STEPS = ['Property Info', 'Location', 'Specs & Price', 'Agent & Media'];

export default function PostProperty() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    property_type: "Apartment",
    country: "India",
    city: "",
    state: "",
    address: "",
    price: "",
    currency: "INR",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    agent_name: "",
    agent_company: "",
    agent_phone: "",
    agent_email: "",
    video_url: "",
    features: [],
    gallery: ["", "", "", "", ""],
    floor_plans: []
  });

  const addFloorPlan = () => {
    setFormData(prev => ({
      ...prev,
      floor_plans: [
        ...prev.floor_plans,
        { type: "", area_sqft: "", price: "", image_path: "", possession_date: "", tag: "" }
      ]
    }));
  };

  const removeFloorPlan = (index) => {
    setFormData(prev => ({
      ...prev,
      floor_plans: prev.floor_plans.filter((_, i) => i !== index)
    }));
  };

  const handleFloorPlanChange = (index, field, value) => {
    const newPlans = [...formData.floor_plans];
    newPlans[index][field] = value;
    setFormData(prev => ({ ...prev, floor_plans: newPlans }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleArrayChange = (name, index, value) => {
    const newArr = [...formData[name]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [name]: newArr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/realestate', formData)
    .then(res => {
      navigate('/real-estate/find');
    })
    .catch(err => {
      console.error(err);
      alert("Error submitting property. Please check all required fields.");
    });
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  return (
    <main>
      <Navbar />
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <Typography variant="h4" fontWeight={900} mb={1} color="#1f2937" sx={{ fontFamily: "'Outfit', sans-serif" }}>
              List Your Property 🏡
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={6}>
              Reach thousands of NRI buyers in India and Dubai with a professional listing.
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 8 }}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Property Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Luxury 3BHK Apartment with Sea View" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Custom URL Slug" 
                      name="slug" 
                      value={formData.slug} 
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/ /g, '-') }))}
                      placeholder="e.g. south-mumbai-luxury-3bhk"
                      InputProps={{
                        startAdornment: <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5 }}>desipath.com/property/</Typography>,
                      }}
                      helperText="A unique link for your property"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={4} label="Property Description" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the property, amenities, and neighborhood..." />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Property Type</InputLabel>
                      <Select name="property_type" value={formData.property_type} label="Property Type" onChange={handleChange} required>
                        {PROPERTY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select name="country" value={formData.country} label="Country" onChange={handleChange} required>
                        {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="State / Emirate" name="state" value={formData.state} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Detailed Address" name="address" value={formData.address} onChange={handleChange} required />
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth type="number" label="Area (Sq. Ft.)" name="area_sqft" value={formData.area_sqft} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth type="number" label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth type="number" label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField 
                      fullWidth 
                      type="number" 
                      label="Asking Price" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange} 
                      required 
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{formData.currency}</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select name="currency" value={formData.currency} label="Currency" onChange={handleChange}>
                        <MenuItem value="INR">INR (₹)</MenuItem>
                        <MenuItem value="AED">AED (د.إ)</MenuItem>
                        <MenuItem value="USD">USD ($)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Key Features</InputLabel>
                      <Select
                        multiple
                        value={formData.features}
                        onChange={(e) => handleMultiSelect('features', e.target.value)}
                        input={<OutlinedInput label="Key Features" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                          </Box>
                        )}
                      >
                        {FEATURES_OPTIONS.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={formData.features.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {activeStep === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Agent / Owner Name" name="agent_name" value={formData.agent_name} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Company Name" name="agent_company" value={formData.agent_company} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Contact Phone" name="agent_phone" value={formData.agent_phone} onChange={handleChange} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Contact Email" name="agent_email" value={formData.agent_email} onChange={handleChange} required />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={800} mb={2}>Video & Gallery</Typography>
                    <TextField fullWidth label="YouTube Video Link" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." sx={{ mb: 3 }} />
                    
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="subtitle2" fontWeight={800}>Unit Floor Plans & Pricing</Typography>
                        <Button variant="outlined" size="small" onClick={addFloorPlan} sx={{ borderRadius: '8px' }}>+ Add Variant</Button>
                    </div>
                    
                    {formData.floor_plans.map((plan, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 3, mb: 2, borderRadius: '16px', position: 'relative' }}>
                            <Button 
                                onClick={() => removeFloorPlan(idx)}
                                sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main', minWidth: 0, p: 0.5 }}
                            >
                                ✕
                            </Button>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" label="Layout Type" value={plan.type} onChange={(e) => handleFloorPlanChange(idx, 'type', e.target.value)} placeholder="e.g. 2 BHK Smart" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" type="number" label="Area (Sqft)" value={plan.area_sqft} onChange={(e) => handleFloorPlanChange(idx, 'area_sqft', e.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" type="number" label="Price" value={plan.price} onChange={(e) => handleFloorPlanChange(idx, 'price', e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">{formData.currency}</InputAdornment> }} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" label="Layout Image URL" value={plan.image_path} onChange={(e) => handleFloorPlanChange(idx, 'image_path', e.target.value)} placeholder="https://..." />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" label="Possession Starts" value={plan.possession_date} onChange={(e) => handleFloorPlanChange(idx, 'possession_date', e.target.value)} placeholder="e.g. Aug '25" />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth size="small" label="Comments / Tag" value={plan.tag} onChange={(e) => handleFloorPlanChange(idx, 'tag', e.target.value)} placeholder="e.g. Best Value" />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                    
                    <Typography variant="subtitle2" fontWeight={800} mb={2} sx={{ mt: 4 }}>Gallery Images</Typography>
                    
                    <Grid container spacing={2}>
                      {formData.gallery.map((url, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                          <TextField 
                            fullWidth 
                            label={`Gallery Image ${idx + 1}`} 
                            value={url} 
                            onChange={(e) => handleArrayChange('gallery', idx, e.target.value)}
                            placeholder="Image URL..."
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ fontWeight: 800 }}>Back</Button>
                {activeStep === STEPS.length - 1 ? (
                  <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#1d4ed8', px: 6, borderRadius: '12px', fontWeight: 900 }}>
                    Publish Property 🏡
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext} sx={{ bgcolor: '#1d4ed8', px: 6, borderRadius: '12px', fontWeight: 900 }}>
                    Continue
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
      <Footer newsletter="none" />
    </main>
  );
}
