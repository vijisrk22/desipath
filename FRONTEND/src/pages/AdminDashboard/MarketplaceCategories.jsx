import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function MarketplaceCategories() {
  const [module, setModule] = useState('kids_class');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', color: '', accent: '' });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', icon: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/marketplace/categories?module=${module}`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [module]);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/api/admin/categories/${editingCategory.id}`, categoryForm);
      } else {
        await api.post('/api/admin/categories', { ...categoryForm, module });
      }
      setEditingCategory(null);
      setCategoryForm({ name: '', icon: '', color: '', accent: '' });
      fetchCategories();
    } catch (err) {
      alert("Error saving category");
    }
  };

  const handleSaveSubcategory = async (catId, e) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await api.put(`/api/admin/subcategories/${editingSubcategory.id}`, subcategoryForm);
      } else {
        await api.post(`/api/admin/categories/${catId}/subcategories`, subcategoryForm);
      }
      setEditingSubcategory(null);
      setSubcategoryForm({ name: '', icon: '' });
      fetchCategories();
    } catch (err) {
      alert("Error saving subcategory");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure? This will delete all subcategories too.")) {
      await api.delete(`/api/admin/categories/${id}`);
      fetchCategories();
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/api/admin/subcategories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Category Management</h1>
          <p className="text-gray-500">Manage listing categories and subcategories for each module.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setModule('kids_class')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${module === 'kids_class' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🎨 Kids Class
          </button>
          <button 
            onClick={() => setModule('it_training')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${module === 'it_training' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            💻 IT Training
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Category Form & List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Categories for {module === 'kids_class' ? 'Kids Class' : 'IT Training'}</h2>
              <button 
                onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', icon: '', color: '', accent: '' }); }}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                + Add New Category
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-10 text-center text-gray-400">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No categories found.</div>
              ) : categories.map(cat => (
                <div key={cat.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cat.accent || 'bg-gray-100 text-gray-600'}`}>
                        {cat.icon || '📁'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{cat.name}</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm({ name: cat.name, icon: cat.icon || '', color: cat.color || '', accent: cat.accent || '' });
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                        title="Edit Category"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Subcategories List */}
                  <div className="ml-16 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase">Subcategories</span>
                      <button 
                        onClick={() => { setEditingSubcategory({ category_id: cat.id }); setSubcategoryForm({ name: '', icon: '' }); }}
                        className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                      >
                        + Add Sub
                      </button>
                    </div>
                    <div className="p-3 flex flex-wrap gap-2">
                      {cat.subcategories && cat.subcategories.length > 0 ? cat.subcategories.map(sub => (
                        <div key={sub.id} className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-100 rounded-xl transition-all">
                          <span className="text-xs">{sub.icon || '🔹'}</span>
                          <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                          <div className="hidden group-hover:flex items-center gap-1 ml-2">
                            <button 
                              onClick={() => { setEditingSubcategory(sub); setSubcategoryForm({ name: sub.name, icon: sub.icon || '' }); }}
                              className="text-[10px] hover:text-blue-600"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteSubcategory(sub.id)}
                              className="text-[10px] hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )) : (
                        <span className="text-xs text-gray-300 italic px-2">No subcategories</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="space-y-6">
          {/* Category Form */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Programming"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Icon (Emoji)</label>
                  <input 
                    type="text"
                    value={categoryForm.icon}
                    onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="💻"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Color (Tailwind)</label>
                  <input 
                    type="text"
                    value={categoryForm.color}
                    onChange={e => setCategoryForm({...categoryForm, color: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="bg-blue-50..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Accent (Tailwind)</label>
                <input 
                  type="text"
                  value={categoryForm.accent}
                  onChange={e => setCategoryForm({...categoryForm, accent: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="bg-blue-100..."
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {editingCategory ? 'Update' : 'Save'} Category
                </button>
                {editingCategory && (
                  <button 
                    type="button"
                    onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', icon: '', color: '', accent: '' }); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Subcategory Form (shown when adding/editing sub) */}
          {(editingSubcategory) && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
              <h3 className="font-bold text-gray-900 mb-4">
                {editingSubcategory.id ? 'Edit' : 'Add'} Subcategory 
                {editingSubcategory.category_id && !editingSubcategory.id && ' for ' + categories.find(c => c.id === editingSubcategory.category_id)?.name}
              </h3>
              <form onSubmit={(e) => handleSaveSubcategory(editingSubcategory.category_id, e)} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <input 
                    type="text"
                    required
                    value={subcategoryForm.name}
                    onChange={e => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Python"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Icon</label>
                  <input 
                    type="text"
                    value={subcategoryForm.icon}
                    onChange={e => setSubcategoryForm({...subcategoryForm, icon: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="🔹"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    {editingSubcategory.id ? 'Update' : 'Save'} Subcategory
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEditingSubcategory(null); setSubcategoryForm({ name: '', icon: '' }); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl"
                  >
                    ✕
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
