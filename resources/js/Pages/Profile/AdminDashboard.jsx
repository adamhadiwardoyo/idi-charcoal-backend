import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import BlogManager from './Partials/BlogManager'; // 👈 IMPORT THE NEW COMPONENT

export default function AdminDashboard({ auth }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the form
  const [form, setForm] = useState({ id: null, quote: '', author: '', location: '' });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/testimonials/${form.id}` : '/api/testimonials';

    try {
      await api[method](url, form);
      resetForm();
      fetchTestimonials(); // Refresh the list
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setForm(testimonial);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/api/testimonials/${id}`);
        fetchTestimonials(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
      }
    }
  };

  const resetForm = () => {
    setForm({ id: null, quote: '', author: '', location: '' });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
    >
      <Head title="Admin Dashboard" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* 👇 REPLACE THE OLD CONTENT WITH THIS 👇 */}
          <BlogManager />
        </div>
      </div>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Form Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{form.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="author">Author</label>
                <input id="author" name="author" value={form.author} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <input id="location" name="location" value={form.location} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="quote">Quote</label>
                <textarea id="quote" name="quote" value={form.quote} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="4" required></textarea>
              </div>
              <div className="flex items-center gap-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {loading ? <p>Loading testimonials...</p> : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Author</th>
                        <th className="px-4 py-2 border">Location</th>
                        <th className="px-4 py-2 border">Quote</th>
                        <th className="px-4 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-2 border">{t.author}</td>
                          <td className="px-4 py-2 border">{t.location}</td>
                          <td className="px-4 py-2 border">{t.quote}</td>
                          <td className="px-4 py-2 border space-x-2">
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
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}