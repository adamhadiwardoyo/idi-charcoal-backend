import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner'; // Impor toast

// Shadcn UI component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icon imports
import { ExternalLink, Loader2 } from 'lucide-react'; // Impor Loader2

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    company_profile_url: '',
    catalog_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // State untuk proses penyimpanan

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
        console.error("Gagal mengambil pengaturan:", error);
        toast.error("Gagal mengambil pengaturan.");
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
    setIsSaving(true); // Mulai proses penyimpanan
    try {
      await api.post('/api/settings', settings);
      toast.success('Pengaturan berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal memperbarui pengaturan:', error);
      toast.error('Gagal memperbarui pengaturan.');
    } finally {
      setIsSaving(false); // Selesaikan proses penyimpanan
    }
  };

  if (loading) return <p>Memuat pengaturan...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Download</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_profile_url">URL Profil Perusahaan</Label>
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
                <a href={settings.company_profile_url || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={!settings.company_profile_url}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="catalog_url">URL Katalog</Label>
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
                <a href={settings.catalog_url || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={!settings.catalog_url}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Pengaturan
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}