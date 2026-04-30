import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import Step1Profile from './Step1Profile';
import Step2ClassBasic from './Step2ClassBasic';
import Step3Schedule from './Step3Schedule';
import Step4AboutTabbed from './Step4AboutTabbed';
import Step5Pricing from './Step5Pricing';
import Step6Preview from './Step6Preview';

import api from '../../../utils/api';

export default function InstructorPortal() {
  const navigate = useNavigate();
  const { id: editClassId } = useParams();
  const isEditMode = !!editClassId;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(isEditMode);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Master state for the massive form
  const [formData, setFormData] = useState({
    instructorId: 'new', // will be replaced with UUID
    classId: 'new',
    // Step 1
    instructorInfo: {
      accountType: 'individual',
      name: '',
      photoUrl: null,
      bio: '',
      yearsExperience: '',
      qualifications: [],
      languages: [],
      city: '',
      state: '',
      email: '',
      phone: ''
    },
    // Step 2... 6
    classBasic: {},
    schedule: {},
    about: { overview: {}, curriculum: [], requirements: {} },
    pricing: {}
  });

  const [lastSaved, setLastSaved] = useState(null);

  // Debounced Auto-save (MOCK API CALL for now)
  const autoSave = useCallback((data) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    if (isEditMode && editClassId) {
      // Fetch existing class data to hydrate the form
      api.get(`/api/kids-classes/admin/details/${editClassId}`)
        .then(res => {
          const result = res.data;
          if (result.success && result.data) {
            const { classBasic, instructor, schedule, about, pricing, reqs, modules } = result.data;
            setFormData({
              instructorId: instructor?.id || 'new',
              classId: classBasic?.id || 'new',
              instructorInfo: {
                accountType: instructor?.account_type || 'individual',
                name: instructor?.name || '',
                photoUrl: instructor?.profile_photo_url || null,
                bio: instructor?.bio || '',
                yearsExperience: instructor?.years_experience || '',
                city: '', state: '', email: instructor?.email || '', phone: instructor?.phone || ''
              },
              classBasic: {
                title: classBasic?.title || '', category: classBasic?.category || '', subcategory: classBasic?.subcategory || '',
                level: classBasic?.level || [], format: classBasic?.format || [], shortDescription: classBasic?.short_description || '',
                tags: classBasic?.tags || [], ageGroup: classBasic ? [`${classBasic.age_group_min}-${classBasic.age_group_max} yrs`] : []
              },
              schedule: {
                duration: schedule?.duration_label || '', totalSessions: schedule?.total_sessions || '',
                sessionLength: schedule?.session_length_minutes || '', daysOfWeek: schedule?.days_of_week || [],
                timeStart: schedule?.time_start || '', timeEnd: schedule?.time_end || '',
                startDate: schedule?.batch_start_date || '', location: schedule?.location_address || '',
                platform: schedule?.online_platform || '', maxStudents: schedule?.max_students || '', trialAvailable: schedule?.trial_available || false,
              },
              about: {
                overview: {
                  detailedDescription: about?.detailed_description || '', whoIsItFor: about?.who_is_it_for || [],
                  whatWillKidsLearn: about?.what_will_kids_learn || [], highlights: about?.highlights || [],
                },
                curriculum: modules?.map(m => ({ title: m.title, description: m.description, duration: m.estimated_duration })) || [],
                requirements: {
                  prerequisites: reqs?.prerequisites || [], materialsNeeded: reqs?.materials_needed || [],
                  techRequirements: reqs?.tech_requirements || [], parentalInvolvement: reqs?.parental_involvement || '',
                }
              },
              pricing: {
                feeAmount: pricing?.fee_amount || 0, feeType: pricing?.fee_type || 'per_month',
                discountLabel: pricing?.discount_label || '', certificateProvided: pricing?.certificate_provided || false,
              }
            });
          }
        })
        .catch(err => {
          console.error("Hydration failed:", err);
          // Don't crash the form, just let them edit a blank one or try again
        })
        .finally(() => setIsLoadingDraft(false));
    } else {
      setIsLoadingDraft(false);
    }
  }, [isEditMode, editClassId]);

  useEffect(() => {
    if (isLoadingDraft) return;
    const handler = setTimeout(() => {
      if (currentStep < 6) {
        autoSave(formData);
      }
    }, 3000);
    return () => clearTimeout(handler);
  }, [formData, autoSave, currentStep, isLoadingDraft]);

  const updateFormData = (stepKey, data) => {
    setFormData(prev => ({ ...prev, [stepKey]: { ...prev[stepKey], ...data } }));
    
    // Clear validation errors for the keys being updated
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const setTopLevelData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = () => {
    const errors = {};
    if (currentStep === 1) {
      const info = formData.instructorInfo;
      if (!info.name?.trim()) errors.name = 'Full Name is required';
      if (!info.photoUrl) errors.photoUrl = 'Profile Photo is required';
      if (!info.bio?.trim()) errors.bio = 'Bio is required';
      if (!info.yearsExperience) errors.yearsExperience = 'Experience is required';
      if (!info.email?.trim()) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(info.email)) errors.email = 'Invalid email format';
      if (!info.phone?.trim()) errors.phone = 'Phone Number is required';
    }
    // Step 2... 5 could be added here later
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
       // Scroll to top or show alert if needed
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    console.log("Navigating to next step:", currentStep + 1);
    setValidationErrors({}); // Clear errors on success
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };
  const prevStep = () => {
    console.log("Navigating to previous step:", currentStep - 1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Render the current step component dynamically
  const renderStep = () => {
    try {
      switch (currentStep) {
        case 1: return <Step1Profile 
          data={formData.instructorInfo || {}} 
          instructorId={formData.instructorId}
          update={(d) => updateFormData('instructorInfo', d)} 
          setInstructorId={(id) => setTopLevelData({ instructorId: id })}
          errors={validationErrors}
        />;
        case 2: return <Step2ClassBasic data={formData.classBasic || {}} update={(d) => updateFormData('classBasic', d)} />;
        case 3: return <Step3Schedule data={formData.schedule || {}} update={(d) => updateFormData('schedule', d)} />;
        case 4: return <Step4AboutTabbed data={formData.about || {}} update={(d) => updateFormData('about', d)} />;
        case 5: return <Step5Pricing data={formData.pricing || {}} update={(d) => updateFormData('pricing', d)} />;
        case 6: return <Step6Preview data={formData} onEditStep={setCurrentStep} />;
        default: return <div className="text-center py-10">Invalid Step</div>;
      }
    } catch (err) {
      console.error("Step rendering crashed:", err);
      return (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong.</h2>
          <p className="text-red-600 mb-4">There was an error displaying this step. Please try refreshing.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full font-bold"
          >
            Refresh Page
          </button>
        </div>
      );
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const endpoint = isEditMode ? `/api/kids-classes/${editClassId}` : '/api/kids-classes';
      const result = await (isEditMode ? api.put(endpoint, formData) : api.post(endpoint, formData));
      
      if (result.data.success) {
        navigate('/kids-class/instructor-portal/success');
      } else {
        alert('Submission failed: ' + result.data.message);
      }
    } catch (err) {
      alert('Network error during submission.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      {/* Sticky Progress Navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Become an Instructor</h1>
            <p className="text-sm text-gray-500">Step {currentStep} of 6</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            {isSaving ? (
               <span className="text-blue-500 flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> Saving...
               </span>
            ) : lastSaved ? (
               <span className="text-green-600">Draft saved at {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        {isLoadingDraft ? (
           <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
            {renderStep()}
          </div>
        )}

        {/* Form Navigation Controls */}
        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          
          {currentStep < 6 ? (
            <button 
              onClick={nextStep}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              Continue to Next Step
            </button>
          ) : (
            <button 
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-500/30 transition-all"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Submitting...' : isEditMode ? 'Update Listing' : 'Submit Listing for Review'}
            </button>
          )}
        </div>
      </main>
      
      <div className="mt-8">
        <Footer newsletter={"block"} />
      </div>
    </div>
  );
}
