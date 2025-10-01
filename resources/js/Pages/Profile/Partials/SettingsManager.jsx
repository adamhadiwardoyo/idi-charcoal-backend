import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

// Shadcn UI component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icon imports
import { ExternalLink } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    company_profile_url: '',
    catalog_url: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/settings');
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
    <Card>
      <CardHeader>
        <CardTitle>Manage Document Links</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_profile_url">Company Profile URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="company_profile_url"
                name="company_profile_url"
                type="url"
                value={settings.company_profile_url}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
              <Button variant="outline" size="icon" asChild>
                <a href={settings.company_profile_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="catalog_url">Catalog URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="catalog_url"
                name="catalog_url"
                type="url"
                value={settings.catalog_url}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
              <Button variant="outline" size="icon" asChild>
                <a href={settings.catalog_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Settings</Button>
        </CardFooter>
      </form>
    </Card>
  );
}