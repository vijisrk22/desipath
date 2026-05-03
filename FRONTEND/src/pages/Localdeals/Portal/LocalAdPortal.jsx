import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import Step1Business from './Step1Business';
import Step2AdDetails from './Step2AdDetails';
import Step3Media from './Step3Media';
import Step4Review from './Step4Review';
import api from '../../../utils/api';

export default function LocalAdPortal() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = !!editId;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  const [formData, setFormData] = useState({
    // Step 1: Business
    businessName: '',
    ownerName: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA',
    ownerPhone: '',
    ownerEmail: '',
    
    // Step 2: Ad
    title: '',
    description: '',
    displayPhone: '',
    displayEmail: '',
    isContactDifferent: false,
    adContactName: '',
    adContactEmail: '',
    adContactPhone: '',
    category: 'Restaurant & Food',
    tags: [],
    
    // Step 3: Media
    images: [] // Base64 or existing URLs
  });

  useEffect(() => {
    if (isEditMode && editId) {
      setIsLoading(true);
      api.get(`/api/local-ads/${editId}`)
        .then(res => {
          const ad = res.data;
          const biz = ad.business_account;
          setFormData({
            businessName: biz?.business_name || '',
            ownerName: biz?.contact_person_name || '',
            address: biz?.address_line1 || '',
            city: ad.location_city || '',
            state: ad.location_state || '',
            zipcode: ad.zipcode || '',
            country: ad.country || 'USA',
            ownerPhone: biz?.contact_person_phone || '',
            ownerEmail: biz?.contact_person_email || '',
            
            title: ad.title || '',
            description: ad.description || '',
            displayPhone: ad.display_phone || '',
            displayEmail: ad.display_email || '',
            isContactDifferent: ad.is_contact_person_different || false,
            adContactName: ad.ad_contact_name || '',
            adContactEmail: ad.ad_contact_email || '',
            adContactPhone: ad.ad_contact_phone || '',
            category: ad.category || 'Restaurant & Food',
            tags: ad.tags || [],
            tagsStr: (ad.tags || []).join(', '),
            images: ad.poster_urls || []
          });
        })
        .catch(err => console.error("Hydration failed", err))
        .finally(() => setIsLoading(false));
    }
  }, [editId, isEditMode]);

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleStep2Submit = (values) => {
    // Process tagsStr into tags array before updating
    const tags = values.tagsStr ? values.tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    updateFormData({ ...values, tags });
    nextStep();
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Prepare payload for backend store method
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location_city: formData.city,
        location_state: formData.state,
        zipcode: formData.zipcode,
        country: formData.country,
        website_url: '', // optional
        tags: formData.tags,
        images: formData.images,
        
        // Business Profile updates
        business_address: formData.address,
        contact_person_name: formData.ownerName,
        contact_person_email: formData.ownerEmail,
        contact_person_phone: formData.ownerPhone,
        
        // Ad Contact overrides
        display_phone: formData.displayPhone,
        display_email: formData.displayEmail,
        is_contact_person_different: formData.isContactDifferent,
        ad_contact_name: formData.adContactName,
        ad_contact_email: formData.adContactEmail,
        ad_contact_phone: formData.adContactPhone
      };

      const endpoint = isEditMode ? `/api/local-ads/${editId}` : '/api/local-ads';
      const res = await (isEditMode ? api.put(endpoint, payload) : api.post(endpoint, payload));
      
      if (res.status === 201 || res.status === 200 || res.data.success) {
        navigate('/services/Localdeals/post/success');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit ad. Please check all fields.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Business data={formData} update={updateFormData} onNext={nextStep} />;
      case 2: return <Step2AdDetails data={formData} update={updateFormData} onNext={handleStep2Submit} onBack={prevStep} />;
      case 3: return <Step3Media data={formData} update={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4Review data={formData} onBack={prevStep} onSubmit={handleSubmit} isSaving={isSaving} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Post a Local Deal</h1>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Step {currentStep} of 4
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12">
            {renderStep()}
          </div>
        )}
      </main>

      <Footer newsletter={"block"} />
    </div>
  );
}
