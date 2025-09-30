import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    company_profile_url: '',
    catalog_url: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.get('/api/settings');
      setSettings(response.data);
      setLoading(false);
    };
    initialize();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/settings', settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings.');
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Links</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company_profile_url" className="block font-medium text-gray-700">Company Profile URL</label>
          <input
            id="company_profile_url"
            name="company_profile_url"
            type="url"
            value={settings.company_profile_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="catalog_url" className="block font-medium text-gray-700">Catalog URL</label>
          <input
            id="catalog_url"
            name="catalog_url"
            type="url"
            value={settings.catalog_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}