import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/gallery");
      setImages(res.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      await api.post('/api/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchImages(); // Refresh the gallery
    } catch (error) {
      console.error('Failed to upload image:', error.response?.data);
      alert('Upload failed! Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/api/gallery/${id}`);
        fetchImages(); // Refresh the gallery
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Gallery Manager</h2>

      {/* Upload Form */}
      <div className="mb-6">
        <label htmlFor="image-upload" className="btn-primary cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload New Image'}
        </label>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={uploading}
        />
      </div>

      {/* Image Grid */}
      {loading ? <p>Loading gallery...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map(image => (
            <div key={image.id} className="relative group border rounded-lg overflow-hidden">
              <img src={`/storage/${image.path}`} alt="" className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}