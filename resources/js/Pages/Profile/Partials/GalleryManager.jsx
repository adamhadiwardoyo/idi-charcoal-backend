import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

// Shadcn UI & Icon imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/gallery");
      setImages(res.data);
    } catch (error) {
      console.error("Gagal mengambil gambar:", error);
      toast.error("Gagal mengambil gambar dari server.");
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Gambar berhasil diunggah!");
      fetchImages(); // Muat ulang galeri
    } catch (error) {
      console.error('Gagal mengunggah gambar:', error.response?.data);
      toast.error('Gagal mengunggah gambar! Periksa konsol untuk detail.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    try {
      await api.delete(`/api/gallery/${imageToDelete.id}`);
      toast.success("Gambar berhasil dihapus.");
      fetchImages(); // Muat ulang galeri
    } catch (error) {
      console.error('Gagal menghapus gambar:', error);
      toast.error("Gagal menghapus gambar.");
    } finally {
      setShowDeleteDialog(false);
      setImageToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajer Galeri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button asChild className="cursor-pointer">
            <label htmlFor="image-upload">
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {uploading ? 'Mengunggah...' : 'Unggah Gambar Baru'}
            </label>
          </Button>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={uploading}
          />
        </div>

        {loading ? <p>Memuat galeri...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(image => (
              <Dialog key={image.id}>
                <div className="relative group border rounded-lg overflow-hidden">
                  <DialogTrigger asChild>
                    <img src={image.url} alt={`Galeri ${image.id}`} className="w-full h-32 object-cover cursor-pointer" />
                  </DialogTrigger>
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Pratinjau Gambar</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <img src={image.url} alt={`Pratinjau Galeri ${image.id}`} className="max-w-full max-h-[80vh] object-contain" />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Gambar ini akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}