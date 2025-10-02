import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

// Shadcn UI component imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Icon imports
import { Edit, Trash2, Eye } from 'lucide-react';

// Komponen preview kartu testimonial
const TestimonialCardPreview = ({ quote, author, location }) => (
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
  const [form, setForm] = useState({
    id: null,
    quote: '',
    author: '',
    location: '',
    is_active: true
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  useEffect(() => {
    const initializeAndFetch = async () => {
      setLoading(true);
      try {
        await api.get('/sanctum/csrf-cookie');
        const res = await api.get("/api/admin/testimonials");
        setTestimonials(res.data);
      } catch (error) {
        console.error("Gagal mengambil data testimonial:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAndFetch();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/api/admin/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error("Gagal mengambil data testimonial:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/api/testimonials/${id}/toggle`);
      fetchTestimonials();
      toast.success("Status berhasil diubah!");
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      toast.error("Gagal mengubah status.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setForm(prev => ({ ...prev, is_active: checked }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUpdating = !!form.id;

    try {
      if (isUpdating) {
        // Kirim semua data termasuk is_active
        await api.patch(`/api/testimonials/${form.id}`, {
          quote: form.quote,
          author: form.author,
          location: form.location,
          is_active: form.is_active,
        });
      } else {
        await api.post('/api/testimonials', form);
      }

      toast.success("Testimonial berhasil disimpan!");
      resetForm();
      fetchTestimonials();

    } catch (error) {
      console.error('Gagal menyimpan testimonial:', error.response?.data);
      toast.error("Gagal menyimpan testimonial.");
    }
  };



  const handleEdit = (testimonial) => {
    // Pastikan data yang masuk ke form adalah salinan agar tidak mengubah state asli
    setForm({ ...testimonial });
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    try {
      await api.delete(`/api/testimonials/${testimonialToDelete.id}`);
      fetchTestimonials();
      toast.success("Testimonial berhasil dihapus.");
    } catch (error) {
      console.error('Gagal menghapus testimonial:', error);
      toast.error("Gagal menghapus testimonial.");
    } finally {
      setShowDeleteDialog(false);
      setTestimonialToDelete(null);
    }
  };

  const resetForm = () => {
    setForm({ id: null, quote: '', author: '', location: '', is_active: true });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{form.id ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Nama</Label>
                <Input id="author" name="author" value={form.author} onChange={handleFormChange} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Negara</Label>
                <Input id="location" name="location" value={form.location} onChange={handleFormChange} placeholder="Indonesia" required />
                <p className="text-sm text-gray-500 leading-relaxed">
                  Masukkan nama negara saja.
                  <br />Contoh: <em>Indonesia, Malaysia, USA</em>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">Isi Testimonial</Label>
              <Textarea
                id="quote"
                name="quote"
                value={form.quote}
                onChange={handleFormChange}
                placeholder="Tuliskan pengalaman atau komentar di sini..."
                rows="4"
                required
              />
              <p className="text-sm text-gray-500 leading-relaxed">
                Tulis pengalaman tanpa tanda kutip (<span className="font-mono">""</span> atau <span className="font-mono">''</span>).
                <br />Contoh benar: <em>Sangat puas dengan layanan ini, akan merekomendasikan ke teman.</em>
              </p>
            </div>

          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit">Simpan</Button>
            <Button variant="outline" type="button" onClick={resetForm}>Batal</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Mengambil data...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Negara</TableHead>
                  <TableHead>Isi</TableHead>
                  <TableHead className="text-right w-[150px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id} className={!t.is_active ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Switch checked={t.is_active} onCheckedChange={() => handleToggleStatus(t.id)} />
                    </TableCell>
                    <TableCell className="font-medium">{t.author}</TableCell>
                    <TableCell>{t.location}</TableCell>
                    <TableCell className="whitespace-normal text-sm text-muted-foreground">
                      {t.quote}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Pratinjau Testimonial</DialogTitle>
                          </DialogHeader>
                          <TestimonialCardPreview {...t} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(t)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Testimonial dari "{testimonialToDelete?.author}" akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}