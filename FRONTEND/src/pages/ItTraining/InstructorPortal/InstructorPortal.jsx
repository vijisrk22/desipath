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

export default function ItInstructorPortal() {
  const navigate = useNavigate();
  const { id: editClassId } = useParams();
  const isEditMode = !!editClassId;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(isEditMode);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    instructorId: 'new',
    classId: 'new',
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
    classBasic: {},
    schedule: {},
    about: { overview: {}, curriculum: [], requirements: {} },
    pricing: {}
  });

  const [lastSaved, setLastSaved] = useState(null);

  const autoSave = useCallback((data) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    if (isEditMode && editClassId) {
      api.get(`/api/it-training/${editClassId}`)
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
                tags: classBasic?.tags || []
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
                  whatWillKidsLearn: about?.what_will_learn || [], highlights: about?.highlights || [],
                },
                curriculum: modules?.map(m => ({ title: m.title, description: m.description, duration: m.estimated_duration })) || [],
                requirements: {
                  prerequisites: reqs?.prerequisites || [], materialsNeeded: reqs?.materials_needed || [],
                  techRequirements: reqs?.tech_requirements || [],
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
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    setValidationErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
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
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const endpoint = isEditMode ? `/api/it-training/${editClassId}` : '/api/it-training';
      const result = await (isEditMode ? api.put(endpoint, formData) : api.post(endpoint, formData));
      
      if (result.data.success) {
        navigate('/it-training/instructor-portal/success');
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
      <Navbar />
      
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900">IT Instructor Portal</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Step {currentStep} of 6 • {currentStep === 6 ? 'Final Review' : 'Create Training Program'}</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            {isSaving ? (
               <span className="text-blue-600 flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> Saving Progress...
               </span>
            ) : lastSaved ? (
               <span className="text-gray-400">Draft saved at {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>
        
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-500"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10">
        {isLoadingDraft ? (
           <div className="flex justify-center p-20"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-gray-100">
            {renderStep()}
          </div>
        )}

        <div className="mt-10 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-4 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous Step
          </button>
          
          {currentStep < 6 ? (
            <button 
              onClick={nextStep}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              Continue to Next
            </button>
          ) : (
            <button 
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:scale-95"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Publishing...' : isEditMode ? 'Update Training Program' : 'Publish Training Program'}
            </button>
          )}
        </div>
      </main>
      
      <div className="mt-10">
        <Footer newsletter={"block"} />
      </div>
    </div>
  );
}
