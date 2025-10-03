import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Impor CardDescription
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from 'lucide-react';
import axios from '@/api/axios';
import { toast } from "sonner";

export default function TopicManager() {
  // ✅ topics is initialized to an empty array `[]`, so `topics.map` will not crash.
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topicName, setTopicName] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/topics');
      setTopics(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data topik.");
      setTopics([]); // Ensure topics is an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const apiCall = currentTopic
      ? axios.put(`/api/topics/${currentTopic.id}`, { name: topicName })
      : axios.post('/api/topics', { name: topicName });

    try {
      await apiCall;
      toast.success(`Topik berhasil ${currentTopic ? 'diperbarui' : 'dibuat'}.`);
      fetchTopics();
      setIsDialogOpen(false);
      setCurrentTopic(null);
      setTopicName('');
    } catch (error) {
      toast.error("Terjadi kesalahan.");
    }
  };

  const handleEditClick = (topic) => {
    setCurrentTopic(topic);
    setTopicName(topic.name);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (topic) => {
    if (window.confirm(`Anda yakin ingin menghapus topik "${topic.name}"?`)) {
      try {
        await axios.delete(`/api/topics/${topic.id}`);
        toast.success("Topik berhasil dihapus.");
        fetchTopics();
      } catch (error) {
        toast.error("Gagal menghapus topik.");
      }
    }
  };

  return (
    <Card>
      {/* === PERUBAHAN DI SINI === */}
      <CardHeader>
        <div className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Manajemen Topik</CardTitle>
            <CardDescription className="mt-2">
              Ini adalah Topik yang dipilih untuk dijadikan artikel multi bahasa di laman Blog
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setCurrentTopic(null); setTopicName(''); }}>Tambah Topik</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentTopic ? 'Edit' : 'Tambah'} Topik</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Nama Topik"
                  required
                />
                <Button type="submit">{currentTopic ? 'Update' : 'Simpan'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      {/* === AKHIR PERUBAHAN === */}
      <CardContent>
        {loading ? <p>Memuat...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Topik</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ✅ This checks the length and maps over `topics`, not `posts` */}
              {topics.length > 0 ? (
                topics.map(topic => (
                  <TableRow key={topic.id}>
                    <TableCell>{topic.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(topic)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(topic)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="2" className="text-center">Belum ada topik.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}