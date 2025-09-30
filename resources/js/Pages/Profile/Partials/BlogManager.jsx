import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  image: '/placeholder.webp',
  date: new Date().toISOString().split('T')[0], // Today's date
  category: 'Market Analysis',
  meta_title: '',
  meta_description: '',
  contents: [{ type: 'p', text: '' }] // Start with one paragraph
};

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (index, field, value) => {
    const newContents = [...form.contents];
    newContents[index][field] = value;
    // Special handling for 'ul' items
    if (field === 'items' && typeof value === 'string') {
      newContents[index][field] = value.split('\n');
    }
    setForm(prev => ({ ...prev, contents: newContents }));
  };

  const addContentBlock = (type) => {
    let newBlock = { type };
    if (type === 'ul') {
      newBlock.items = ['List item 1'];
    } else {
      newBlock.text = '';
    }
    setForm(prev => ({ ...prev, contents: [...prev.contents, newBlock] }));
  };

  const removeContentBlock = (index) => {
    setForm(prev => ({ ...prev, contents: prev.contents.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/posts/${form.id}` : '/api/posts';

    try {
      await api[method](url, form);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Failed to save post:', error.response.data);
    }
  };

  const handleEdit = (post) => {
    // Fetch full post data to edit
    api.get(`/api/posts/${post.slug}`).then(res => {
      setForm({
        ...res.data,
        date: new Date(res.data.date).toISOString().split('T')[0] // Format date for input
      });
      window.scrollTo(0, 0); // Scroll to top
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/api/posts/${id}`);
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{form.id ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main post details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" className="input" required />
            <input name="slug" value={form.slug} onChange={handleFormChange} placeholder="URL Slug (e.g., my-new-post)" className="input" required />
            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="input" required />
            <input name="date" type="date" value={form.date} onChange={handleFormChange} className="input" required />
            <input name="image" value={form.image} onChange={handleFormChange} placeholder="Image Path (e.g., /image.webp)" className="input" required />
          </div>
          <textarea name="excerpt" value={form.excerpt} onChange={handleFormChange} placeholder="Excerpt..." className="input w-full" rows="3" required></textarea>

          {/* Meta details */}
          <h3 className="text-lg font-semibold border-t pt-4">SEO Meta</h3>
          <input name="meta_title" value={form.meta_title} onChange={handleFormChange} placeholder="Meta Title" className="input" required />
          <textarea name="meta_description" value={form.meta_description} onChange={handleFormChange} placeholder="Meta Description..." className="input w-full" rows="2" required></textarea>

          {/* Dynamic Content Blocks */}
          <h3 className="text-lg font-semibold border-t pt-4">Post Content</h3>
          <div className="space-y-4">
            {form.contents.map((block, index) => (
              <div key={index} className="p-4 border rounded-md relative">
                <button type="button" onClick={() => removeContentBlock(index)} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
                <label className="font-semibold">{block.type.toUpperCase()}</label>
                {block.type === 'ul' ? (
                  <textarea value={block.items.join('\n')} onChange={e => handleContentChange(index, 'items', e.target.value)} placeholder="Enter list items, one per line..." className="input w-full mt-1" rows="3"></textarea>
                ) : (
                  <textarea value={block.text} onChange={e => handleContentChange(index, 'text', e.target.value)} placeholder={`Enter text for ${block.type}...`} className="input w-full mt-1" rows={block.type === 'p' ? 4 : 1}></textarea>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => addContentBlock('h2')} className="btn-secondary">Add H2</button>
            <button type="button" onClick={() => addContentBlock('h3')} className="btn-secondary">Add H3</button>
            <button type="button" onClick={() => addContentBlock('p')} className="btn-secondary">Add Paragraph</button>
            <button type="button" onClick={() => addContentBlock('ul')} className="btn-secondary">Add List</button>
            <button type="button" onClick={() => addContentBlock('blockquote')} className="btn-secondary">Add Quote</button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 border-t pt-4">
            <button type="submit" className="btn-primary">Save Post</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      {/* Posts Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Existing Posts</h2>
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="th">Title</th>
                  <th className="th">Category</th>
                  <th className="th">Date</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="td">{post.title}</td>
                    <td className="td">{post.category}</td>
                    <td className="td">{new Date(post.date).toLocaleDateString()}</td>
                    <td className="td space-x-2">
                      <button onClick={() => handleEdit(post)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Add some generic styles to your resources/css/app.css if you don't have them
// .input { @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50; }
// .btn-primary { @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700; }
// .btn-secondary { @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300; }
// .th { @apply px-4 py-2 border text-left; }
// .td { @apply px-4 py-2 border; }