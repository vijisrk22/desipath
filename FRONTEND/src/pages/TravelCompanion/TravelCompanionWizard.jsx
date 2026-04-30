import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  TextField,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  ArrowForward, 
  CheckCircle,
  ShieldOutlined,
  Translate,
  CalendarMonth,
  Flight,
  CardGiftcard
} from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RouteBuilder from '../../components/TravelCompanion/RouteBuilder';
import BrowseListings from './BrowseListings';
import MyTravelPosts from './MyTravelPosts';
import api from '../../utils/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import dayjs from 'dayjs';

const steps = ['Details', 'Schedule', 'Route', 'Preferences', 'Review'];

const TravelCompanionWizard = ({ type = 'seeker' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1
    traveler_relation: 'parents',
    traveler_age: '',
    travelling_as: 'individual',
    prior_experience: false,
    languages: [],
    // Step 2
    travel_direction: 'india_to_usa_canada',
    travel_date_confirmed: true,
    travel_date: '',
    travel_month_from: '',
    travel_month_to: '',
    // Step 3
    route_legs: [],
    // Step 4
    special_needs: [],
    comfortable_helping: [],
    gift_card_offer: '50',
    gift_card_preference: 'free',
    // Step 5
    comments: '',
    agree_to_terms: false
  });

  const [loading, setLoading] = useState(false);
  const isEditing = !!location.state?.editData;

  useEffect(() => {
    if (location.state?.editData) {
      const data = { ...location.state.editData };
      
      // Format dates for input[type="date"]
      if (data.travel_date) data.travel_date = dayjs(data.travel_date).format('YYYY-MM-DD');
      if (data.travel_month_from) data.travel_month_from = dayjs(data.travel_month_from).format('YYYY-MM-DD');
      if (data.travel_month_to) data.travel_month_to = dayjs(data.travel_month_to).format('YYYY-MM-DD');
      
      setFormData({
        ...data,
        agree_to_terms: true // User already agreed if editing
      });
    }
  }, [location.state]);

  if (type === 'browse-volunteers') return <BrowseListings type="volunteer" />;
  if (type === 'browse-requests') return <BrowseListings type="seeker" />;
  if (type === 'my-posts') return <MyTravelPosts />;
  if (type === 'guidelines') return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="flex-grow pt-6 pb-20 px-4">
        <div className="hidden md:block max-w-4xl mx-auto mb-6">
          <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
          <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
          <Link to="/travel-companion" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Travel Companion</Link>
          <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
          <span className="text-gray-900 text-sm font-bold font-dmsans">Guidelines</span>
        </div>
        <div className="max-w-5xl mx-auto bg-white p-8 md:p-14 rounded-[40px] shadow-sm border border-gray-100">
          <div className="mb-12 border-b border-gray-100 pb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">
              Safety & Moderation Policy
            </h1>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p className="font-bold text-gray-800">Desipath Travel Companion is a community trust service — not a commercial travel agency.</p>
              <p>The platform does not guarantee, verify, or take responsibility for any travel arrangements.</p>
              <p>All interactions are voluntary. Safety framework must be built in at every touchpoint.</p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-black text-[#2563eb] mb-8 flex items-center gap-3">
              <ShieldOutlined /> 14.1 Mandatory Safety Disclaimers
            </h2>
            <div className="overflow-hidden rounded-3xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-5 text-sm font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Location</th>
                    <th className="p-5 text-sm font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Disclaimer Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="p-5 font-bold text-gray-700 bg-gray-50/30 w-1/4">Landing Page</td>
                    <td className="p-5 text-gray-600 leading-relaxed italic">
                      "Safety Notice: Desipath Travel Companion is a community service. We do not screen or background-check any volunteer. Always verify identity independently before travel."
                    </td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold text-gray-700 bg-gray-50/30">Post Confirmation</td>
                    <td className="p-5 text-gray-600 leading-relaxed italic">
                      "I understand that Desipath does not verify volunteers or seekers. I am responsible for my own travel safety decisions. I agree to the Community Safety Guidelines."
                    </td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold text-gray-700 bg-gray-50/30">Volunteer Profile Cards</td>
                    <td className="p-5 text-gray-600 leading-relaxed italic">
                      "Desipath does not background-check volunteers. Verify independently before travel."
                    </td>
                  </tr>
                  <tr>
                    <td className="p-5 font-bold text-gray-700 bg-gray-50/30">Chat Initiation</td>
                    <td className="p-5 text-gray-600 leading-relaxed italic">
                      "Safety Reminder: Do not share passport numbers, bank details, or home address. Report suspicious behaviour using the flag icon."
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-red-600 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">!</span>
              14.2 Prohibited Behaviour
            </h2>
            <div className="grid gap-4">
              {[
                "Requesting cash, wire transfers, or monetary compensation outside agreed Amazon Gift Card",
                "Sharing or requesting passport numbers, visa details, or government ID in chat or posts",
                "Posting fake travel details to collect gift cards without genuine travel intent",
                "Impersonating another person or using a false identity",
                "Sending threatening, abusive, or sexually inappropriate messages",
                "Posting personal contact details (phone, WhatsApp, email) in listings or comments",
                "Creating multiple accounts to game the matching system",
                "Sharing external payment links in chat or comments",
                "Using the platform for any commercial or business purpose",
                "Targeting elderly or vulnerable travelers for fraudulent purposes"
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center font-black text-gray-400 text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 font-medium pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 p-8 bg-blue-50 rounded-[32px] text-center">
            <p className="text-blue-800 font-bold mb-4">Questions about safety?</p>
            <Link to="/contact">
              <button className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );


  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang) => {
    const newLangs = formData.languages.includes(lang)
      ? formData.languages.filter(l => l !== lang)
      : [...formData.languages, lang];
    updateData('languages', newLangs);
  };

  const toggleChecklist = (field, item) => {
    const list = formData[field] || [];
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    updateData(field, newList);
  };

  const handlePublish = async () => {
    if (!formData.agree_to_terms) return;
    setLoading(true);
    try {
      const isRequest = type === 'seeker';
      const baseUrl = isRequest ? '/api/travel-companion/requests' : '/api/travel-companion/volunteer-posts';
      const endpoint = isEditing ? `${baseUrl}/${formData.id}` : baseUrl;
      
      const submitData = { ...formData };
      delete submitData.agree_to_terms;
      
      if (isEditing) {
        await api.patch(endpoint, submitData);
      } else {
        await api.post(endpoint, submitData);
      }
      
      navigate('/travel-companion/post-success', { state: { isEdit: isEditing } });
    } catch (err) {
      console.error(err);
      alert("Failed to publish post. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8 py-4">
            {type === 'seeker' ? (
              <>
                <Box>
                  <label className="block font-bold text-gray-700 mb-4 flex items-center gap-2">
                    Who is travelling?
                  </label>
                  <RadioGroup 
                    value={formData.traveler_relation}
                    onChange={(e) => updateData('traveler_relation', e.target.value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    {['parents', 'spouse', 'friend', 'other'].map((rel) => (
                      <FormControlLabel
                        key={rel}
                        value={rel}
                        control={<Radio sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                        label={<span className="capitalize font-medium">{rel}</span>}
                        className={`m-0 p-4 rounded-2xl border-2 transition-all ${
                          formData.traveler_relation === rel ? 'border-[#2563eb] bg-blue-50' : 'border-gray-100 bg-white'
                        }`}
                      />
                    ))}
                  </RadioGroup>
                </Box>
                <Box>
                <label className="block font-bold text-gray-700 mb-2">Approximate Age</label>
                  <TextField 
                    fullWidth
                    type="number"
                    placeholder="e.g. 65"
                    value={formData.traveler_age}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 2) {
                        updateData('traveler_age', val);
                      }
                    }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                    }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <label className="block font-bold text-gray-700 mb-4">Travelling as</label>
                  <RadioGroup 
                    value={formData.travelling_as}
                    onChange={(e) => updateData('travelling_as', e.target.value)}
                    className="grid grid-cols-3 gap-4"
                  >
                    {['individual', 'couple', 'family'].map((opt) => (
                      <FormControlLabel
                        key={opt}
                        value={opt}
                        control={<Radio sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} />}
                        label={<span className="capitalize font-medium">{opt}</span>}
                        className={`m-0 p-4 rounded-2xl border-2 transition-all ${
                          formData.travelling_as === opt ? 'border-[#2563eb] bg-blue-50' : 'border-gray-100 bg-white'
                        }`}
                      />
                    ))}
                  </RadioGroup>
                </Box>
                <Box className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.prior_experience}
                        onChange={(e) => updateData('prior_experience', e.target.checked)}
                        sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }} 
                      />
                    }
                    label={<div className="font-bold text-gray-700">I have prior experience helping others during travel</div>}
                  />
                </Box>
              </>
            )}
            
            <Box>
              <label className="block font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Translate fontSize="small" className="text-gray-400" /> Languages Required
              </label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Gujarati', 'Punjabi', 'Bengali'].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-all border-2 text-sm font-normal ${
                      formData.languages.includes(lang) 
                        ? 'bg-[#2563eb] border-[#2563eb] text-white' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </Box>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 py-4">
             <Box>
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    onClick={() => updateData('travel_direction', 'india_to_usa_canada')}
                    className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all text-center font-black text-xl flex items-center justify-center min-h-[100px] ${
                      formData.travel_direction === 'india_to_usa_canada' ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    India to USA/Canada
                  </div>
                  <div 
                    onClick={() => updateData('travel_direction', 'usa_canada_to_india')}
                    className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all text-center font-black text-xl flex items-center justify-center min-h-[100px] ${
                      formData.travel_direction === 'usa_canada_to_india' ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    USA/Canada to India
                  </div>
                </div>
              </Box>

              <Box>
                <label className="block font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <CalendarMonth className="text-gray-400" fontSize="small" /> Schedule
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => updateData('travel_date_confirmed', true)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.travel_date_confirmed ? 'border-[#2563eb] bg-blue-50' : 'border-gray-100 bg-white'}`}
                  >
                    <div className="font-black text-xs uppercase tracking-widest mb-1 text-gray-400">Confirmed</div>
                    <div className="font-bold">I have a specific date</div>
                  </div>
                  <div 
                    onClick={() => updateData('travel_date_confirmed', false)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${!formData.travel_date_confirmed ? 'border-[#2563eb] bg-blue-50' : 'border-gray-100 bg-white'}`}
                  >
                   <div className="font-black text-xs uppercase tracking-widest mb-1 text-gray-400">Flexible</div>
                   <div className="font-bold">Browsing by month</div>
                  </div>
                </div>

                <div className="mt-6">
                  {formData.travel_date_confirmed ? (
                    <TextField 
                      fullWidth
                      label="Travel Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      value={formData.travel_date}
                      onChange={(e) => updateData('travel_date', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <TextField 
                        label="From Month"
                        type="month"
                        InputLabelProps={{ shrink: true }}
                        value={formData.travel_month_from}
                        onChange={(e) => updateData('travel_month_from', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                      <TextField 
                        label="To Month"
                        type="month"
                        InputLabelProps={{ shrink: true }}
                        value={formData.travel_month_to}
                        onChange={(e) => updateData('travel_month_to', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </div>
                  )}
                </div>
              </Box>
          </div>
        );
      case 2:
        return (
          <div className="py-4">
            <RouteBuilder 
              initialLegs={formData.route_legs.length > 0 ? formData.route_legs : undefined}
              onChange={(legs) => updateData('route_legs', legs)}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 py-4">
            <Box>
              <label className="block font-bold text-gray-700 mb-4 flex items-center gap-2">
                {type === 'seeker' ? 'What assistance is needed?' : 'What can you help with?'}
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                 {(type === 'seeker' 
                  ? ['Wheelchair assistance', 'Language translation', 'Navigation & Boarding', 'Customs forms', 'Food & Refreshments', 'Medication reminders'] 
                  : ['Navigation', 'Document handling', 'Hindi/English Translation', 'Senior care', 'Kid assistance', 'General company']
                 ).map((item) => (
                   <div 
                    key={item}
                    onClick={() => toggleChecklist(type === 'seeker' ? 'special_needs' : 'comfortable_helping', item)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      (formData[type === 'seeker' ? 'special_needs' : 'comfortable_helping'] || []).includes(item)
                        ? 'border-[#2563eb] bg-blue-50 text-blue-900'
                        : 'border-gray-100 bg-white text-gray-600'
                    }`}
                   >
                     <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                       (formData[type === 'seeker' ? 'special_needs' : 'comfortable_helping'] || []).includes(item) ? 'bg-[#2563eb] border-[#2563eb]' : 'border-gray-300'
                     }`}>
                       {(formData[type === 'seeker' ? 'special_needs' : 'comfortable_helping'] || []).includes(item) && <CheckCircle sx={{ fontSize: 14, color: 'white' }} />}
                     </div>
                     <span className="font-bold text-sm">{item}</span>
                   </div>
                 ))}
              </div>
            </Box>

            <Box className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
              <label className="block font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CardGiftcard fontSize="small" /> {type === 'seeker' ? 'Amazon Gift Card Offer' : 'Gift Card Preference'}
              </label>
              <RadioGroup 
                value={type === 'seeker' ? formData.gift_card_offer : formData.gift_card_preference}
                onChange={(e) => updateData(type === 'seeker' ? 'gift_card_offer' : 'gift_card_preference', e.target.value)}
                className="grid grid-cols-3 gap-4"
              >
                 {(type === 'seeker' ? ['0', '50', '100'] : ['free', '50', '100']).map((val) => (
                   <FormControlLabel
                    key={val}
                    value={val}
                    control={<Radio sx={{ opacity: 0, width: 0 }} />}
                    label={
                      <div className="text-center">
                        <div className="text-xl font-black mb-1">{val === 'free' || val === '0' ? 'None' : `$${val}`}</div>
                        <div className="text-[10px] uppercase font-bold text-blue-400">Value</div>
                      </div>
                    }
                    className={`m-0 py-4 flex flex-col items-center justify-center rounded-2xl border-2 transition-all ${
                      (type === 'seeker' ? formData.gift_card_offer : formData.gift_card_preference) === val 
                        ? 'border-blue-500 bg-white text-blue-600 shadow-sm' 
                        : 'border-blue-100 bg-blue-50/50 text-blue-300'
                    }`}
                  />
                 ))}
              </RadioGroup>
              <p className="text-xs text-blue-400 mt-4 text-center italic">
                Note: Gift card is a social agreement between users. Desipath does not handle payments.
              </p>
            </Box>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 py-4">
            <Box>
               <label className="block font-bold text-gray-700 mb-2">Additional Comments</label>
               <TextField 
                multiline
                rows={4}
                fullWidth
                placeholder="Share any other details that might help find a good match..."
                value={formData.comments}
                onChange={(e) => updateData('comments', e.target.value.slice(0, 300))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
               />
               <div className="text-right text-[10px] font-bold text-gray-400 mt-1 uppercase">
                 {formData.comments.length} / 300 Characters
               </div>
            </Box>

            <Box className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 space-y-4">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <ShieldOutlined /> Community Safety Disclaimer
              </div>
              <p className="text-sm text-red-600/80 leading-relaxed font-medium">
                Desipath connects travelers but does not conduct background checks. For your safety, always meet in public areas of the airport, do not share financial details, and inform your family about your travel match. Desipath is not liable for any incidents during travel.
              </p>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.agree_to_terms}
                    onChange={(e) => updateData('agree_to_terms', e.target.checked)}
                    sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }} 
                  />
                }
                label={<div className="font-bold text-red-900 text-sm">I have read the safety guidelines and agree to the terms</div>}
              />
            </Box>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Navbar />
      <div className="flex-grow bg-gray-100/30 pt-6 pb-24 px-4">
      <div className="hidden md:block max-w-3xl mx-auto mb-6">
        <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
        <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
        <Link to="/travel-companion" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Travel Companion</Link>
        <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
        <span className="text-gray-900 text-sm font-bold font-dmsans capitalize">
          {type.replace('-', ' ')}
        </span>
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#2563eb] text-xs font-black uppercase tracking-widest rounded-full mb-4">
            {isEditing ? 'Edit' : 'Post'} {type === 'seeker' ? 'Request' : 'Volunteer'}
          </div>
          <h1 className="text-3xl font-black text-gray-900">
            {isEditing ? 'Update your Route' : (type === 'seeker' ? 'Find a Travel Helper' : 'Offer Travel Assistance')}
          </h1>
        </div>

        {/* Stepper */}
        <Box sx={{ mb: 8 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: '#2563eb' },
                      '&.Mui-completed': { color: '#2563eb' },
                      '& .MuiStepIcon-text': { fill: 'white', fontWeight: 800 },
                      width: 34,
                      height: 34
                    }
                  }}
                >
                  <span className={`text-[0.7rem] font-black uppercase tracking-widest ${activeStep === index ? 'text-gray-900 border-b-2 border-blue-500 pb-1' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderStepContent(activeStep)}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="hidden md:flex">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ 
                borderRadius: '16px', 
                px: 4, 
                py: 1.5, 
                color: 'gray', 
                textTransform: 'none', 
                fontWeight: 700 
              }}
            >
              Back
            </Button>
          </div>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              disabled={!formData.agree_to_terms || loading}
              onClick={handlePublish}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle sx={{ color: 'white' }} />}
              sx={{ 
                borderRadius: '16px', 
                px: 6, 
                py: 1.5, 
                bgcolor: '#2563eb', 
                '&:hover': { bgcolor: '#1d4ed8' },
                color: 'white !important',
                textTransform: 'none',
                fontWeight: 800,
                boxShadow: '0 8px 20px -6px rgba(37,99,235,0.4)',
                '& .MuiButton-startIcon': { color: 'white' }
              }}
            >
              {loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Post' : 'Publish Post')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward sx={{ color: 'white' }} />}
              sx={{ 
                borderRadius: '16px', 
                px: 6, 
                py: 1.5, 
                bgcolor: '#2563eb', 
                '&:hover': { bgcolor: '#1d4ed8' },
                color: 'white !important',
                textTransform: 'none',
                fontWeight: 800,
                '& .MuiButton-endIcon': { color: 'white' }
              }}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default TravelCompanionWizard;
