import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import Modal from '@/Components/Modal'; // We'll use the existing Modal for the preview

// A simple card component for the preview, mimicking your public site
const TestimonialCard = ({ quote, author, location }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-inner text-left">
    <p className="text-gray-600 mb-4">&ldquo;{quote}&rdquo;</p>
    <div>
      <p className="font-bold text-gray-900">{author}</p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  </div>
);


export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, quote: '', author: '', location: '', is_active: true });

  // State for the preview modal
  const [previewingTestimonial, setPreviewingTestimonial] = useState(null);

  useEffect(() => {
    const initializeAndFetch = async () => {
      await api.get('/sanctum/csrf-cookie');
      fetchTestimonials();
    };
    initializeAndFetch();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Use the new admin route to get ALL testimonials
      const res = await api.get("/api/admin/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/api/testimonials/${id}/toggle`);
      fetchTestimonials(); // Refresh list to show new status
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/testimonials/${form.id}` : '/api/testimonials';

    try {
      await api[method](url, form);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setForm(testimonial);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/api/testimonials/${id}`);
        fetchTestimonials();
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
      }
    }
  };

  const resetForm = () => {
    setForm({ id: null, quote: '', author: '', location: '', is_active: true });
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{form.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... form inputs ... */}
          <div>
            <label htmlFor="author">Author</label>
            <input id="author" name="author" value={form.author} onChange={handleFormChange} className="input" required />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={form.location} onChange={handleFormChange} className="input" required />
          </div>
          <div>
            <label htmlFor="quote">Quote</label>
            <textarea id="quote" name="quote" value={form.quote} onChange={handleFormChange} className="input" rows="4" required></textarea>
          </div>
          <div className="flex items-center">
            <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleFormChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible on public site)</label>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Testimonials</h2>
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="th">Status</th>
                  <th className="th">Author</th>
                  <th className="th">Location</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className={!t.is_active ? 'bg-gray-50' : ''}>
                    <td className="td">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td">{t.author}</td>
                    <td className="td">{t.location}</td>
                    <td className="td space-x-2">
                      <button onClick={() => handleToggleStatus(t.id)} className="text-gray-600 hover:underline">{t.is_active ? 'Deactivate' : 'Activate'}</button>
                      <button onClick={() => setPreviewingTestimonial(t)} className="text-indigo-600 hover:underline">Preview</button>
                      <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal show={!!previewingTestimonial} onClose={() => setPreviewingTestimonial(null)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonial Preview</h3>
          {previewingTestimonial && <TestimonialCard {...previewingTestimonial} />}
          <div className="mt-6">
            <button onClick={() => setPreviewingTestimonial(null)} className="btn-secondary">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}