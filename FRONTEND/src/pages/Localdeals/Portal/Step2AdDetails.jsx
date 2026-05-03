import React from 'react';
import TextFieldInput from '../../../components/InputTemplate/TextFieldInput';
import DescriptionInput from '../../../components/InputTemplate/DescriptionInput';
import SelectInput from '../../../components/InputTemplate/SelectInput';
import CheckBoxInput from '../../../components/InputTemplate/CheckBoxInput';
import { useForm } from 'react-hook-form';
import api from '../../../utils/api';

export default function Step2AdDetails({ data, update, onNext, onBack }) {
  console.log("Step2AdDetails rendering...");
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: data
  });

  const isContactDifferent = watch('isContactDifferent');

  const onSubmit = (values) => {
    update(values);
    onNext();
  };

  const [categories, setCategories] = React.useState([
    "Restaurant & Food", "Grocery & Retail", "Beauty & Wellness", 
    "Healthcare", "Education & Tutoring", "IT & Technology", 
    "Legal & Financial", "Home Services", "Travel & Immigration", 
    "Events & Entertainment", "Other"
  ]);

  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/api/marketplace/categories?module=local_ads');
        if (res.data.success && res.data.data.length > 0) {
          setCategories(res.data.data.map(c => c.name));
        }
      } catch (err) {
        console.error("Error fetching categories for local ads:", err);
      }
    };
    fetchCats();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Details</h2>
        <p className="text-gray-500">Specify the offer details and how customers should reach you.</p>
      </div>

      <div className="space-y-6">
        <TextFieldInput 
          name="title"
          text="Ad Title" 
          defaultValue="e.g. 50% Off Full Stack Bootcamp"
          control={control}
          requiredAssertion={true}
        />

        <SelectInput 
          name="category"
          label="Category" 
          data={categories}
          control={control}
        />

        <DescriptionInput 
          name="description"
          text="Offer Description" 
          placeholder="Describe your special offer, terms and conditions..."
          control={control}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextFieldInput 
            name="displayPhone"
            text="Phone Number to Display" 
            defaultValue="This will be visible on the Ad"
            control={control}
          />
          <TextFieldInput 
            name="displayEmail"
            text="Email to Display" 
            defaultValue="This will be visible on the Ad"
            control={control}
          />
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('isContactDifferent')}
            />
            <span className="font-bold text-gray-700">Is the Ad Contact Person different from Business Owner?</span>
          </label>

          {isContactDifferent && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-in fade-in slide-in-from-top-2">
              <TextFieldInput 
                name="adContactName"
                text="Contact Name" 
                defaultValue="Name"
                control={control}
              />
              <TextFieldInput 
                name="adContactEmail"
                text="Contact Email" 
                defaultValue="Email"
                control={control}
              />
              <TextFieldInput 
                name="adContactPhone"
                text="Contact Phone" 
                defaultValue="Phone"
                control={control}
              />
            </div>
          )}
        </div>

        <TextFieldInput 
          name="tagsStr"
          text="Hashtags (Comma separated, max 5)" 
          defaultValue="e.g. Sale, Discount, Tech, WebDev"
          control={control}
          rules={{
              validate: (val) => {
                  if (!val) return true;
                  const tags = val.split(',').map(t => t.trim()).filter(Boolean);
                  return tags.length <= 5 || 'Maximum 5 tags allowed';
              }
          }}
          onChange={(e) => {
              const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
              update({ tags: tags, tagsStr: e.target.value });
          }}
        />
      </div>

      <div className="pt-6 flex justify-between">
        <button 
          type="button"
          onClick={onBack}
          className="px-8 py-4 font-bold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back
        </button>
        <button 
          type="submit"
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          Continue to Media
        </button>
      </div>
    </form>
  );
}
