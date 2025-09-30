// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../";

export default function AdminDashboard() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Welcome, only admins can see this page 🚀</p>

      {loading ? (
        <p className="mt-4">Loading testimonials...</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Author</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Quote</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 border">{t.author}</td>
                    <td className="px-4 py-2 border">{t.location}</td>
                    <td className="px-4 py-2 border">{t.quote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
