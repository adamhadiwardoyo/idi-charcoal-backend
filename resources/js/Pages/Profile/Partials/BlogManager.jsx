import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

// Shadcn UI & Icon imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, PlusCircle, XCircle, Loader2 } from 'lucide-react';

const emptyForm = {
  id: null, title: '', slug: '', excerpt: '', image: '', date: new Date().toISOString().split('T')[0],
  category: 'Market Analysis', meta_title: '', meta_description: '', is_active: false, // Default to inactive for safety
  contents: [{ type: 'p', text: '' }]
};

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [postToActivate, setPostToActivate] = useState(null);

  // Initial data fetch
  useEffect(() => {
    const initializeAndFetch = async () => {
      await api.get('/sanctum/csrf-cookie');
      fetchPosts();
    };
    initializeAndFetch();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- MANUAL SAVE LOGIC ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("A title is required before saving.");
      return;
    }
    setIsSaving(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, key === 'contents' ? JSON.stringify(form[key]) : form[key]);
    });
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const url = form.id ? `/api/posts/${form.id}` : '/api/posts';

    try {
      const response = await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (!form.id) {
        setForm(prev => ({ ...prev, id: response.data.id }));
      }
      toast.success("Post saved successfully!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to save post.");
      console.error('Failed to save post:', error.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setForm(prev => ({ ...prev, is_active: checked }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (index, field, value) => {
    const newContents = [...(form.contents || [])];
    newContents[index][field] = value;
    if (field === 'items' && typeof value === 'string') {
      newContents[index][field] = value.split('\n');
    }
    setForm(prev => ({ ...prev, contents: newContents }));
  };

  const addContentBlock = (type) => {
    setForm(prev => ({ ...prev, contents: [...(prev.contents || []), { type, text: '', items: [] }] }));
  };

  const removeContentBlock = (index) => {
    setForm(prev => ({ ...prev, contents: prev.contents.filter((_, i) => i !== index) }));
  };

  const handleEdit = (post) => {
    api.get(`/api/posts/${post.slug}`).then(res => {
      setForm({
        ...res.data,
        date: new Date(res.data.date).toISOString().split('T')[0]
      });
      setImagePreview(res.data.image ? `/storage/${res.data.image}` : '');
      setImageFile(null);
      window.scrollTo(0, 0);
    });
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/api/posts/${postToDelete.id}`);
      toast.success("Post deleted successfully.");
      fetchPosts();
      if (form.id === postToDelete.id) resetForm();
    } catch (error) {
      toast.error("Failed to delete post.");
    } finally {
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
  };

  const handleToggleStatus = (post) => {
    if (!post.is_active) {
      setPostToActivate(post);
      setShowActivateDialog(true);
    } else {
      togglePostStatus(post.id);
    }
  };

  const handleActivateConfirm = () => {
    if (!postToActivate) return;
    togglePostStatus(postToActivate.id);
    setShowActivateDialog(false);
    setPostToActivate(null);
  };

  const togglePostStatus = async (id) => {
    try {
      await api.patch(`/api/posts/${id}/toggle`);
      toast.success("Post status updated!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{form.id ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" value={form.title} onChange={handleFormChange} required /></div>
                <div className="space-y-2"><Label htmlFor="slug">URL Slug</Label><Input id="slug" name="slug" value={form.slug} onChange={handleFormChange} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" value={form.category} onChange={handleFormChange} required /></div>
                  <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" name="date" value={form.date} onChange={handleFormChange} required /></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-2 text-center">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md" /> : <div className="flex items-center justify-center h-32 text-gray-400">No Image</div>}
                  <Input id="imageFile" type="file" onChange={handleImageChange} className="mt-2" />
                </div>
              </div>
            </div>
            <div className="space-y-2"><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleFormChange} rows="3" required /></div>
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">SEO Meta</h3>
              <div className="space-y-2"><Label htmlFor="meta_title">Meta Title</Label><Input id="meta_title" name="meta_title" value={form.meta_title} onChange={handleFormChange} required /></div>
              <div className="space-y-2"><Label htmlFor="meta_description">Meta Description</Label><Textarea id="meta_description" name="meta_description" value={form.meta_description} onChange={handleFormChange} rows="2" required /></div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Post Content</h3>
              {form.contents && form.contents.map((block, index) => (
                <Card key={index} className="relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" type="button" onClick={() => removeContentBlock(index)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                  <CardHeader><CardTitle className="text-base">{block.type.toUpperCase()}</CardTitle></CardHeader>
                  <CardContent>
                    {block.type === 'ul' ? <Textarea value={Array.isArray(block.items) ? block.items.join('\n') : ''} onChange={e => handleContentChange(index, 'items', e.target.value)} placeholder="One item per line..." rows="4" /> : <Textarea value={block.text || ''} onChange={e => handleContentChange(index, 'text', e.target.value)} placeholder="Enter content..." rows={block.type === 'p' ? 5 : 2} />}
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" type="button" onClick={() => addContentBlock('h2')}><PlusCircle className="h-4 w-4 mr-2" />H2</Button>
                <Button variant="outline" size="sm" type="button" onClick={() => addContentBlock('h3')}><PlusCircle className="h-4 w-4 mr-2" />H3</Button>
                <Button variant="outline" size="sm" type="button" onClick={() => addContentBlock('p')}><PlusCircle className="h-4 w-4 mr-2" />Paragraph</Button>
                <Button variant="outline" size="sm" type="button" onClick={() => addContentBlock('ul')}><PlusCircle className="h-4 w-4 mr-2" />List</Button>
                <Button variant="outline" size="sm" type="button" onClick={() => addContentBlock('blockquote')}><PlusCircle className="h-4 w-4 mr-2" />Quote</Button>
              </div>
            </div>

            {/* --- THIS IS THE FIX --- */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch id="is_active" checked={form.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active">Active (Visible on public site)</Label>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.id ? 'Save Changes' : 'Create Post'}
              </Button>
              <Button variant="outline" type="button" onClick={resetForm} className="ml-2">New Post</Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Posts</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id} className={!post.is_active ? 'bg-muted/50' : ''}>
                    <TableCell><Switch checked={post.is_active} onCheckedChange={() => handleToggleStatus(post)} /></TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(post)}><Trash2 className="h-4 w-4" /></Button>
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the post titled "{postToDelete?.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to publish this post?</AlertDialogTitle>
            <AlertDialogDescription>This will make the post titled "{postToActivate?.title}" visible on your public website.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleActivateConfirm}>Publish</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}