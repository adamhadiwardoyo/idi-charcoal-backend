import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Eye } from 'lucide-react';

export default function PostList({ posts, loading, handleEdit, handleDeleteClick, handleToggleStatus, handlePreviewClick }) {
  return (
    <Card>
      <CardHeader><CardTitle>Postingan yang Ada</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p>Memuat...</p> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Bahasa</TableHead>
                <TableHead>Kategori</TableHead>

                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id} className={!post.is_active ? 'bg-muted/50' : ''}>
                  <TableCell><Switch checked={post.is_active} onCheckedChange={() => handleToggleStatus(post)} /></TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.language.toUpperCase()}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  {/* --- Sel Baru --- */}

                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handlePreviewClick(post)}><Eye className="h-4 w-4" /></Button>
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
  );
}