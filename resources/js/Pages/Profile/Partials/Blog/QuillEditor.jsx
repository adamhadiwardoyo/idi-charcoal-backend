import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

const QuillEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Efek untuk inisialisasi Quill hanya sekali saat komponen dimuat
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });

      // Simpan instance Quill ke ref
      quillRef.current = quill;

      // Set konten awal
      if (value) {
        quill.root.innerHTML = value;
      }

      // Tambahkan listener untuk event 'text-change'
      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  // Efek untuk memperbarui konten editor jika `value` dari parent berubah
  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={editorRef} style={{ minHeight: '200px', backgroundColor: 'white' }} />;
};

export default QuillEditor;