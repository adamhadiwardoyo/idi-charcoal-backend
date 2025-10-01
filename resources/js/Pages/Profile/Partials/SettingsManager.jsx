import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    company_profile_url: '',
    catalog_url: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the settings when the component loads.
    // The Sanctum call is no longer needed here.
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/settings');
        // Ensure we have fallback values if the settings are empty
        setSettings({
          company_profile_url: response.data.company_profile_url || '',
          catalog_url: response.data.catalog_url || '',
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
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
      <h2 className="text-2xl font-bold mb-4">Manage Document Links</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company_profile_url" className="block font-medium text-gray-700">Company Profile URL</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="company_profile_url"
              name="company_profile_url"
              type="url"
              value={settings.company_profile_url}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="https://..."
              required
            />
            {/* --- PREVIEW BUTTON ADDED --- */}
            <a
              href={settings.company_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              Preview
            </a>
          </div>
        </div>
        <div>
          <label htmlFor="catalog_url" className="block font-medium text-gray-700">Catalog URL</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="catalog_url"
              name="catalog_url"
              type="url"
              value={settings.catalog_url}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="https://..."
              required
            />
            {/* --- PREVIEW BUTTON ADDED --- */}
            <a
              href={settings.catalog_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              Preview
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 border-t pt-4">
          <button type="submit" className="btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}