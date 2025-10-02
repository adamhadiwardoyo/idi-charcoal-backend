import React, { useState, useEffect, useRef } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

import PostList from './Blog/PostList';
import PostForm from './Blog/PostForm';
import { DeletePostDialog, ActivatePostDialog } from './Blog/ConfirmationDialogs';
import PostPreview from './Blog/PostPreview';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const emptyForm = {
  id: null, title: '', slug: '', excerpt: '', image: '', date: new Date().toISOString().split('T')[0],
  category: 'Market Analysis', meta_title: '', meta_description: '', is_active: false,
  contents: '',
  language: 'en', // <-- Tambahkan default language
};

export default function BlogManager() {
  // ... (semua state lainnya tetap sama) ...
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
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [postToPreview, setPostToPreview] = useState(null);
  const imageInputRef = useRef(null);

  // ... (useEffect dan fetchPosts tetap sama) ...
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

  // --- Fungsi Baru untuk menangani Select ---
  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ... (handleSave dan fungsi lainnya tetap sama, karena `language` sudah ada di dalam `form` state) ...
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Judul wajib diisi sebelum menyimpan.");
      return;
    }
    setIsSaving(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'is_active') {
        formData.append(key, form[key] ? 1 : 0);
      } else {
        formData.append(key, form[key]);
      }
    });
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    const url = form.id ? `/api/posts/${form.id}` : '/api/posts';
    try {
      await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("Postingan berhasil disimpan!");
      fetchPosts();
      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan postingan.");
      console.error('Failed to save post:', error.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setForm(prev => ({ ...prev, contents: content }));
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleEdit = (post) => {
    api.get(`/api/posts/${post.slug}`).then(res => {
      const postData = res.data;
      setForm({
        ...postData,
        contents: postData.content || '',
        date: new Date(postData.date).toISOString().split('T')[0]
      });
      setImagePreview(postData.image_url ? postData.image_url : '');
      setImageFile(null);
      document.getElementById('post-form-card')?.scrollIntoView({ behavior: 'smooth' });
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
      toast.success("Postingan berhasil dihapus.");
      fetchPosts();
      if (form.id === postToDelete.id) resetForm();
    } catch (error) {
      toast.error("Gagal menghapus postingan.");
    } finally {
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
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
      toast.success("Status postingan berhasil diperbarui!");
      fetchPosts();
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const handlePreviewClick = (post) => {
    api.get(`/api/posts/${post.slug}`).then(res => {
      setPostToPreview(res.data);
      setShowPreviewDialog(true);
    });
  };

  return (
    <div className="space-y-6">
      <PostList
        // ... (props lainnya tetap sama)
        posts={posts}
        loading={loading}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        handleToggleStatus={handleToggleStatus}
        handlePreviewClick={handlePreviewClick}
      />
      <div id="post-form-card">
        <PostForm
          // ... (props lainnya tetap sama)
          form={form}
          handleFormChange={handleFormChange}
          handleSwitchChange={handleSwitchChange}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          imagePreview={imagePreview}
          imageInputRef={imageInputRef}
          handleEditorChange={handleEditorChange}
          handleSelectChange={handleSelectChange} // <-- Kirim prop baru
          handleSave={handleSave}
          isSaving={isSaving}
          resetForm={resetForm}
        />
      </div>

      {/* ... (semua dialog tetap sama) ... */}
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        postToDelete={postToDelete}
      />
      <ActivatePostDialog
        isOpen={showActivateDialog}
        onClose={() => setShowActivateDialog(false)}
        onConfirm={handleActivateConfirm}
        postToActivate={postToActivate}
      />
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Pratinjau Artikel</DialogTitle>
            <DialogDescription>
              Ini adalah pratinjau bagaimana artikel Anda akan terlihat saat dipublikasikan. Anda bisa scroll untuk melihat seluruh konten.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            <PostPreview post={postToPreview} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}