import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
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
  Container
} from '@mui/material';

const COUNTRIES = ["USA", "India", "UAE", "Singapore", "Australia"];
const SERVICE_OPTIONS = [
  "Vedic Astrology", "Horoscope", "Birth Chart", "Nadi Astrology", 
  "Numerology", "Tarot Card Reading", "Palm Reading", "Vastu for Home",
  "Gemstone Recommendation", "Face Reading", "Match Making", "Lal Kitab"
];
const LANGUAGE_OPTIONS = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Gujarati", "Bengali", "Punjabi"];
const CONSULTATION_MODES = ["Phone", "Video", "Chat", "In-Person", "Written Report"];

const STEPS = ['Personal Info', 'Services', 'Packages', 'About'];

export default function PostAstrology() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    display_name: "",
    slug: "",
    astrologer_type: "",
    experience_years: "",
    tagline: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    phone: "",
    email: "",
    services_json: [],
    languages_json: [],
    consultation_modes: [],
    description: "",
    certifications: "",
    video_urls: ["", ""],
    gallery_images: ["", "", "", "", ""],
    packages: [
      { name: "Basic Consultation", duration: "30 min", price: "", description: "" }
    ]
  });

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

  const handlePackageChange = (index, field, value) => {
    const newPackages = [...formData.packages];
    newPackages[index][field] = value;
    setFormData(prev => ({ ...prev, packages: newPackages }));
  };

  const addPackage = () => {
    if (formData.packages.length < 3) {
      setFormData(prev => ({ 
        ...prev, 
        packages: [...prev.packages, { name: "", duration: "", price: "", description: "" }] 
      }));
    }
  };

  const removePackage = (index) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, packages: newPackages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/astrologyads', {
      ...formData,
      price: formData.packages[0]?.price || 0
    })
    .then(res => {
      navigate('/astrologer/postConfirmation');
    })
    .catch(err => {
      console.error(err);
      alert("Error submitting ad. Please check all fields.");
    });
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', border: '1px solid #e2e8f0' }}>
          <Typography variant="h4" fontWeight={900} mb={1} color="#1f2937">
            Share Your Wisdom 🔮
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={6}>
            Create your professional astrologer profile and connect with the global NRI community.
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
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Display Name / Brand Name" name="display_name" value={formData.display_name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Profile URL Slug" 
                    name="slug" 
                    value={formData.slug} 
                    onChange={handleChange} 
                    placeholder="e.g. expert-vijay"
                    InputProps={{
                      startAdornment: <Typography variant="caption" sx={{ color: 'text.disabled', mr: 0.5 }}>desipath.com/astrologer/</Typography>,
                    }}
                    helperText="This will be your unique profile link"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Astrology Type</InputLabel>
                    <Select name="astrologer_type" value={formData.astrologer_type} label="Astrology Type" onChange={handleChange} required>
                      <MenuItem value="Vedic">Vedic</MenuItem>
                      <MenuItem value="Western">Western</MenuItem>
                      <MenuItem value="Numerology">Numerology</MenuItem>
                      <MenuItem value="Tarot">Tarot Reading</MenuItem>
                      <MenuItem value="Psychic">Psychic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="number" label="Years of Experience" name="experience_years" value={formData.experience_years} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Tagline (e.g. Expert in Vastu)" name="tagline" value={formData.tagline} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select name="country" value={formData.country} label="Country" onChange={handleChange} required>
                      {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Detailed Address (Private)" name="address" value={formData.address} onChange={handleChange} required />
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Specializations</InputLabel>
                    <Select
                      multiple
                      value={formData.services_json}
                      onChange={(e) => handleMultiSelect('services_json', e.target.value)}
                      input={<OutlinedInput label="Specializations" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                        </Box>
                      )}
                    >
                      {SERVICE_OPTIONS.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={formData.services_json.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Languages</InputLabel>
                    <Select
                      multiple
                      value={formData.languages_json}
                      onChange={(e) => handleMultiSelect('languages_json', e.target.value)}
                      input={<OutlinedInput label="Languages" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                        </Box>
                      )}
                    >
                      {LANGUAGE_OPTIONS.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={formData.languages_json.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                   <Typography variant="subtitle2" fontWeight={800} mb={2}>Consultation Modes</Typography>
                   <div className="flex flex-wrap gap-4">
                     {CONSULTATION_MODES.map(mode => (
                       <div key={mode} className="flex items-center gap-2">
                         <Checkbox 
                           checked={formData.consultation_modes.includes(mode)} 
                           onChange={(e) => {
                             const newModes = e.target.checked 
                               ? [...formData.consultation_modes, mode]
                               : formData.consultation_modes.filter(m => m !== mode);
                             setFormData(prev => ({ ...prev, consultation_modes: newModes }));
                           }}
                         />
                         <Typography variant="body2">{mode}</Typography>
                       </div>
                     ))}
                   </div>
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={800} mb={3}>Define Your Packages</Typography>
                {formData.packages.map((pkg, idx) => (
                  <Paper key={idx} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: '20px', bgcolor: '#f8fafc' }}>
                    <div className="flex justify-between mb-4">
                      <Typography variant="subtitle1" fontWeight={800}>Package {idx + 1}</Typography>
                      {idx > 0 && <Button color="error" size="small" onClick={() => removePackage(idx)}>Remove</Button>}
                    </div>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Package Name" value={pkg.name} onChange={(e) => handlePackageChange(idx, 'name', e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Duration" value={pkg.duration} placeholder="e.g. 45 min" onChange={(e) => handlePackageChange(idx, 'duration', e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth type="number" label="Price ($)" value={pkg.price} onChange={(e) => handlePackageChange(idx, 'price', e.target.value)} required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={2} label="What's included?" value={pkg.description} onChange={(e) => handlePackageChange(idx, 'description', e.target.value)} required />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                {formData.packages.length < 3 && (
                  <Button variant="dashed" fullWidth onClick={addPackage} sx={{ py: 2, border: '2px dashed #cbd5e1', borderRadius: '20px', color: '#64748b' }}>
                    + Add Another Package
                  </Button>
                )}
              </Box>
            )}

            {activeStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={6} label="About You / Your Journey" name="description" value={formData.description} onChange={handleChange} required placeholder="Minimum 100 characters..." />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Certifications / Achievements" name="certifications" value={formData.certifications} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Contact Phone (Public)" name="phone" value={formData.phone} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Contact Email (Public)" name="email" value={formData.email} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={800} mb={2}>YouTube Consultations (Optional)</Typography>
                  <Grid container spacing={2}>
                    {formData.video_urls.map((url, idx) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <TextField 
                          fullWidth 
                          label={`YouTube Video Link ${idx + 1}`} 
                          value={url} 
                          onChange={(e) => handleArrayChange('video_urls', idx, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={800} mb={2}>Expert Gallery (Optional - Up to 5 Images)</Typography>
                  <Grid container spacing={2}>
                    {formData.gallery_images.map((url, idx) => (
                      <Grid item xs={12} md={4} key={idx}>
                        <TextField 
                          fullWidth 
                          label={`Gallery Image URL ${idx + 1}`} 
                          value={url} 
                          onChange={(e) => handleArrayChange('gallery_images', idx, e.target.value)}
                          placeholder="https://image-link.com/..."
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
                <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#4f46e5', px: 6, borderRadius: '12px', fontWeight: 900 }}>
                  Publish My Profile 🔮
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} sx={{ bgcolor: '#4f46e5', px: 6, borderRadius: '12px', fontWeight: 900 }}>
                  Continue
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

