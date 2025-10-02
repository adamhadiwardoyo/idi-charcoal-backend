import React from 'react';

export default function PostPreview({ post }) {
  if (!post) {
    return null;
  }

  return (
    <article className="p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-4">Kategori: {post.category} | Tanggal: {new Date(post.date).toLocaleDateString()}</p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      {/* 'prose' adalah kelas untuk styling. 
        'dangerouslySetInnerHTML' digunakan untuk merender HTML dari editor.
      */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}