import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

// Komponen-komponen UI
import PostForm from './Blog/PostForm';
import { DeletePostDialog, ActivatePostDialog } from './Blog/ConfirmationDialogs';
import PostPreview from './Blog/PostPreview';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopicList from './Blog/TopicList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// State awal untuk form
const emptyForm = {
  id: null, title: '', slug: '', excerpt: '', image: '', date: new Date().toISOString().split('T')[0],
  category: 'Market Analysis', meta_title: '', meta_description: '', is_active: false,
  contents: '', language: 'en', topic_id: '',
};

export default function BlogManager() {
  // State hooks
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
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
  const formSectionRef = useRef(null);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(false);

  // Efek untuk mengambil data
  useEffect(() => {
    const initializeAndFetch = async () => {
      setLoading(true);
      try {
        await api.get('/sanctum/csrf-cookie');
        await Promise.all([fetchPosts(), fetchTopics()]);
      } catch (error) {
        toast.error("Gagal melakukan inisialisasi data.");
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAndFetch();
  }, []);

  // Efek untuk mendeteksi scroll dan mengatur visibilitas tombol floating
  useEffect(() => {
    const handleScroll = () => {
      const formElement = formSectionRef.current;
      if (!formElement) return;

      const rect = formElement.getBoundingClientRect();
      const isFormVisible = rect.top < window.innerHeight;
      const shouldBeVisible = window.scrollY > 300 && !isFormVisible;
      setIsFloatingButtonVisible(shouldBeVisible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi untuk mengambil postingan
  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/admin/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Gagal mengambil data postingan:", error);
      toast.error("Gagal mengambil data postingan.");
    }
  };

  // Fungsi untuk mengambil topik
  const fetchTopics = async () => {
    try {
      const res = await api.get("/api/topics");
      setTopics(res.data);
    } catch (error) {
      console.error("Gagal mengambil data topik:", error);
      toast.error("Gagal mengambil data topik.");
    }
  };

  // Mengelompokkan postingan berdasarkan topik
  const groupedPosts = useMemo(() => {
    if (posts.length === 0) return {};
    const topicMap = topics.reduce((acc, topic) => {
      acc[topic.id] = topic.name;
      return acc;
    }, {});
    return posts.reduce((acc, post) => {
      const topicName = post.topic_id ? topicMap[post.topic_id] : 'Tanpa Topik';
      if (!acc[topicName]) acc[topicName] = [];
      acc[topicName].push(post);
      return acc;
    }, {});
  }, [posts, topics]);

  // Fungsi untuk mengisi form dari postingan yang sudah ada
  const handlePrefill = (topicName, targetLang) => {
    const topic = topics.find(t => t.name === topicName);
    const topicId = topic ? topic.id : null;

    let sourcePost = posts.find(p => p.topic_id === topicId && p.language === 'en') ||
      posts.find(p => p.topic_id === topicId);

    if (!sourcePost) {
      toast.error("Tidak ditemukan postingan sumber untuk prefill.");
      resetForm();
      setForm(prev => ({ ...prev, language: targetLang }));
      document.getElementById('post-form-card')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    toast.info(`Mengisi form dari postingan '${sourcePost.title}'...`);

    api.get(`/api/posts/${sourcePost.slug}`).then(res => {
      const postData = res.data;
      setForm({
        ...postData,
        id: null,
        title: `${postData.title} (Salinan)`,
        slug: '',
        language: targetLang,
        is_active: false,
        date: new Date().toISOString().split('T')[0],
      });
      setImagePreview(postData.image_url || '');
      setImageFile(null);
      document.getElementById('post-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }).catch(err => {
      toast.error("Gagal mengambil detail postingan sumber.");
    });
  };

  // Fungsi-fungsi handler lainnya
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
      } else if (key === 'topic_id' && !form[key]) {
        return;
      } else {
        formData.append(key, form[key]);
      }
    });
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    if (form.id) {
      formData.append('_method', 'POST');
    }

    const url = form.id ? `/api/posts/${form.id}` : '/api/posts';
    try {
      await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("Postingan berhasil disimpan!");
      fetchPosts();
      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan postingan.");
      console.error('Gagal menyimpan postingan:', error.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post) => {
    api.get(`/api/posts/${post.slug}`).then(res => {
      const postData = res.data;
      setForm({
        ...postData,
        contents: postData.content || '',
        date: new Date(postData.date).toISOString().split('T')[0],
        topic_id: postData.topic_id || ''
      });
      setImagePreview(postData.image_url || '');
      setImageFile(null);
      document.getElementById('post-form-card')?.scrollIntoView({ behavior: 'smooth' });
    });
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

  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
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

  const handleCreateNewPostClick = () => {
    resetForm();
    document.getElementById('post-form-card')?.scrollIntoView({ behavior: 'smooth' });
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Postingan Blog</h2>
        <Button onClick={handleCreateNewPostClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Postingan Baru
        </Button>
      </div>
      <p className="text-muted-foreground">Dibawah ini adalah daftar blog yang tersedia dan tidak tersedia tergantung bahasanya</p>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Daftar Postingan</h3>
          {loading ? (
            <Card><CardContent className="p-6 text-center">Memuat...</CardContent></Card>
          ) : (Object.keys(groupedPosts).length > 0 ? (
            <TopicList
              groupedPosts={groupedPosts}
              handleEdit={handleEdit}
              handleDeleteClick={handleDeleteClick}
              handleToggleStatus={handleToggleStatus}
              handlePreviewClick={handlePreviewClick}
              handlePrefill={handlePrefill}
            />
          ) : (
            <Card><CardContent className="p-6 text-center text-muted-foreground">Belum ada postingan.</CardContent></Card>
          ))}
        </div>

        <div id="post-form-card" ref={formSectionRef}>
          <h3 className="text-xl font-semibold mb-4">
            {form.id ? 'Edit Postingan' : 'Buat Postingan Baru'}
          </h3>
          <PostForm
            form={form}
            topics={topics}
            handleFormChange={handleFormChange}
            handleSwitchChange={handleSwitchChange}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            imagePreview={imagePreview}
            imageInputRef={imageInputRef}
            handleEditorChange={handleEditorChange}
            handleSelectChange={handleSelectChange}
            handleSave={handleSave}
            isSaving={isSaving}
            resetForm={resetForm}
          />
        </div>
      </div>

      <DeletePostDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDeleteConfirm} postToDelete={postToDelete} />
      <ActivatePostDialog isOpen={showActivateDialog} onClose={() => setShowActivateDialog(false)} onConfirm={handleActivateConfirm} postToActivate={postToActivate} />
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Pratinjau Artikel</DialogTitle>
            <DialogDescription>Ini adalah pratinjau bagaimana artikel Anda akan terlihat.</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto"><PostPreview post={postToPreview} /></div>
        </DialogContent>
      </Dialog>

      {isFloatingButtonVisible && (
        <Button
          onClick={handleCreateNewPostClick}
          className="fixed bottom-6 right-6 h-14 w-auto px-4 shadow-lg animate-in fade-in zoom-in-95"
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Buat Postingan Baru
        </Button>
      )}
    </div>
  );
}