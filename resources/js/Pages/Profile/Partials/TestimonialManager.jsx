import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

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

// A simple card component for the preview
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
  const [form, setForm] = useState({ id: null, quote: '', author: '', location: '', is_active: true });

  // State to manage the delete confirmation dialog
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
        console.error("Failed to fetch testimonials:", error);
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
      console.error("Failed to fetch testimonials:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/api/testimonials/${id}/toggle`);
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to toggle status:', error);
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
    const method = form.id ? 'put' : 'post';
    const url = form.id ? `/api/testimonials/${form.id}` : '/api/testimonials';

    try {
      await api[method](url, form);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setForm(testimonial);
    window.scrollTo(0, 0);
  };

  // --- NEW DELETE WORKFLOW ---
  // 1. When the delete button is clicked, set the state to show the dialog
  const handleDeleteClick = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteDialog(true);
  };

  // 2. When the "Continue" button in the dialog is clicked, run the delete API call
  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;
    try {
      await api.delete(`/api/testimonials/${testimonialToDelete.id}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    } finally {
      // 3. Clean up and close the dialog
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
          <CardTitle>{form.id ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={form.author} onChange={handleFormChange} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={form.location} onChange={handleFormChange} placeholder="New York, USA" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" value={form.quote} onChange={handleFormChange} placeholder="Enter the testimonial quote here..." rows="4" required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={form.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active">Active (Visible on public site)</Label>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id} className={!t.is_active ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <Switch checked={t.is_active} onCheckedChange={() => handleToggleStatus(t.id)} />
                    </TableCell>
                    <TableCell className="font-medium">{t.author}</TableCell>
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
                            <DialogTitle>Testimonial Preview</DialogTitle>
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

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the testimonial by "{testimonialToDelete?.author}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}