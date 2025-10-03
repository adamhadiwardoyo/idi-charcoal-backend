import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogManager from './Partials/BlogManager';
import GalleryManager from './Partials/GalleryManager';
import TestimonialManager from './Partials/TestimonialManager';
import SettingsManager from './Partials/SettingsManager';
import TopicManager from './Partials/Blog/TopicManager'; // Impor komponen baru
import axios from '@/api/axios';
import { toast } from "sonner";

export default function AdminDashboard({ auth }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/topics');
      setTopics(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data topik.");
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
    >
      <Head title="Admin Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Tabs defaultValue="blog">
            <TabsList>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger> {/* Trigger Baru */}
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="settings">Link Download</TabsTrigger>
            </TabsList>

            <TabsContent value="blog">
              <BlogManager topics={topics} />
            </TabsContent>
            <TabsContent value="topics">
              <TopicManager />
            </TabsContent>
            <TabsContent value="gallery">
              <GalleryManager />
            </TabsContent>
            <TabsContent value="testimonials">
              <TestimonialManager />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}