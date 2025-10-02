import React from 'react';
import QuillEditor from './QuillEditor';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PostForm({
  form,
  handleFormChange,
  handleSwitchChange,
  handleImageChange,
  handleRemoveImage,
  imagePreview,
  imageInputRef,
  handleEditorChange,
  handleSelectChange,
  handleSave,
  isSaving,
  resetForm
}) {

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'German' },
    { value: 'ar', label: 'Arabic' },
    { value: 'nl', label: 'Dutch' },
    { value: 'zh', label: 'Chinese' },
    { value: 'fr', label: 'French' },
    { value: 'ja', label: 'Japanese' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.id ? 'Ubah Postingan Blog' : 'Buat Postingan Blog Baru'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2"><Label htmlFor="title">Judul Artikel</Label><Input id="title" name="title" value={form.title} onChange={handleFormChange} required /></div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input id="slug" name="slug" value={form.slug} onChange={handleFormChange} required placeholder="contoh-slug-artikel" />
                <p className="text-sm text-gray-500 leading-relaxed">Slug adalah bagian akhir dari URL. Biasanya berupa huruf kecil dengan tanda hubung (-).</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input id="category" name="category" value={form.category} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select value={form.language} onValueChange={(value) => handleSelectChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bahasa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" name="date" value={form.date} onChange={handleFormChange} required />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gambar Artikel</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-2 text-center">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md" /> : <div className="flex items-center justify-center h-32 text-gray-400">Tidak Ada Gambar</div>}
                <Input id="imageFile" type="file" onChange={handleImageChange} className="mt-2" ref={imageInputRef} />
                {imagePreview && (<Button variant="link" size="sm" className="text-red-500" type="button" onClick={handleRemoveImage}>Hapus Gambar</Button>)}
              </div>
            </div>
          </div>
          <div className="space-y-2"><Label htmlFor="excerpt">Kutipan</Label><Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleFormChange} rows="3" required /></div>
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Meta SEO</h3>
            <div className="space-y-2"><Label htmlFor="meta_title">Judul Meta</Label><Input id="meta_title" name="meta_title" value={form.meta_title} onChange={handleFormChange} required placeholder="Judul singkat untuk Google (50-60 karakter)" /></div>
            <div className="space-y-2"><Label htmlFor="meta_description">Deskripsi Meta</Label><Textarea id="meta_description" name="meta_description" value={form.meta_description} onChange={handleFormChange} rows="2" required placeholder="Deskripsi singkat untuk Google (120-160 karakter)" /></div>
          </div>
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-lg font-medium">Konten Postingan</Label>
            <QuillEditor
              value={form.contents}
              onChange={handleEditorChange}
            />
          </div>
        </CardContent>
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4 -mx-6 -mb-6 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="is_active_sticky" checked={form.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active_sticky">Aktif (Tampil di situs publik)</Label>
            </div>
            <div>
              <Button variant="outline" type="button" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit" disabled={isSaving} className="ml-2">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.id ? 'Simpan Perubahan' : 'Buat Postingan'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}