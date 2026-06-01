import React from 'react';
import TextFieldInput from '../../../components/InputTemplate/TextFieldInput';
import SelectInput from '../../../components/InputTemplate/SelectInput';
import LocationAutocompleteInput from '../../../components/InputTemplate/LocationAutocompleteInput';
import { useForm } from 'react-hook-form';

export default function Step1Business({ data, update, onNext }) {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: data
  });

  const onSubmit = (values) => {
    update(values);
    onNext();
  };

  const handleLocationSelect = (locString) => {
    // locString format: "City, State, Zip"
    const parts = locString.split(',').map(p => p.trim());
    if (parts.length === 3) {
      setValue('city', parts[0]);
      setValue('state', parts[1]);
      setValue('zipcode', parts[2]);
      
      // Update the local state immediately so it's ready for next step
      update({ city: parts[0], state: parts[1], zipcode: parts[2] });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Profile</h2>
        <p className="text-gray-500">Tell us about your business. This information helps us verify your listing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        <TextFieldInput 
          name="businessName"
          text="Business Name" 
          defaultValue="e.g. Desipath IT Academy"
          control={control}
          requiredAssertion={true}
        />
        <TextFieldInput 
          name="ownerName"
          text="Business Owner Name" 
          defaultValue="Full Name"
          control={control}
          requiredAssertion={true}
        />
        
        <div className="md:col-span-2">
          <TextFieldInput 
            name="address"
            text="Business Street Address" 
            defaultValue="Street Address, Suite, etc."
            control={control}
            requiredAssertion={true}
          />
        </div>

        <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 mb-4">
          <LocationAutocompleteInput 
            control={control}
            setValue={setValue}
            text="Business Location (City or Zipcode)"
            placeholder="Start typing your city or zip..."
            onSelect={handleLocationSelect}
          />
        </div>

        <SelectInput 
          name="country"
          label="Country" 
          data={['USA', 'Canada']}
          control={control}
        />

        <TextFieldInput 
          name="ownerPhone"
          text="Business Owner Contact Number" 
          defaultValue="(555) 000-0000"
          control={control}
          requiredAssertion={true}
        />
        <TextFieldInput 
          name="ownerEmail"
          text="Business Email ID" 
          defaultValue="owner@business.com"
          control={control}
          rules={{ 
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
          }}
          requiredAssertion={true}
        />
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit"
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          Continue to Ad Details
        </button>
      </div>
    </form>
  );
}
