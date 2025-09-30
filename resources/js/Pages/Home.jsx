import React, { useState, useEffect } from 'react';
import api from '@/api/axios'; // <-- Using your existing axios instance

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch testimonials from your API when the component loads
    api.get('/testimonials')
      .then(response => {
        setTestimonials(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the testimonials:", error);
      });
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 text-lg italic">"{testimonial.quote}"</p>
            <p className="text-right font-semibold text-gray-900 mt-4">- {testimonial.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}