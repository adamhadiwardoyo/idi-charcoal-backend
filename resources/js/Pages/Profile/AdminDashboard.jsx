import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import BlogManager from './Partials/BlogManager';
import GalleryManager from './Partials/GalleryManager';
import TestimonialManager from './Partials/TestimonialManager';
import SettingsManager from './Partials/SettingsManager'; // 👈 Import

export default function AdminDashboard({ auth }) {
  const [activeTab, setActiveTab] = useState('blog');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'blog': return <BlogManager />;
      case 'gallery': return <GalleryManager />;
      case 'testimonials': return <TestimonialManager />;
      case 'settings': return <SettingsManager />; // 👈 Render
      default: return null;
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
          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('blog')} className={`${activeTab === 'blog' ? 'border-indigo-500 text-indigo-600' : 'tab-inactive'}`}>Blog</button>
              <button onClick={() => setActiveTab('gallery')} className={`${activeTab === 'gallery' ? 'border-indigo-500 text-indigo-600' : 'tab-inactive'}`}>Gallery</button>
              <button onClick={() => setActiveTab('testimonials')} className={`${activeTab === 'testimonials' ? 'border-indigo-500 text-indigo-600' : 'tab-inactive'}`}>Testimonials</button>
              <button onClick={() => setActiveTab('settings')} className={`${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'tab-inactive'}`}>Settings</button> {/* 👈 Add button */}
            </nav>
          </div>
          <div>{renderActiveTab()}</div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}