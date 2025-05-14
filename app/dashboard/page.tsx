'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    } else {
      console.error('Failed to fetch products');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Product deleted successfully');
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={fetchProducts}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Service Pages List</h1>

      <table className="table-auto w-full border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th> 
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border">
              <td className="border p-2">{product.title}</td>  
              <td className="border p-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [subtitle, setSubtitle] = useState(product.subtitle || ""); // Added subtitle state
  const [description, setDescription] = useState(product.description);
  const [tservice1, setTService1] = useState(product.tservice1);
  const [service1, setService1] = useState(product.service1 || []);
  const [tservice2, setTService2] = useState(product.tservice2);
  const [service2, setService2] = useState(product.service2 || []);
  const [last, setLast] = useState(product.last);
  const [img, setImg] = useState(product.img);

  const handleAddService = (setService) => {
    setService((prev) => [...prev, { title: "", desc: "" }]);
  };

  const handleRemoveService = (index, setService) => {
    setService((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index, field, value, setService) => {
    setService((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      title,
      subtitle, // Include subtitle in the update
      description,
      tservice1,
      service1,
      tservice2,
      service2,
      last,
      img,
    };

    const response = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      alert("Product updated successfully");
      onSave();
      onCancel();
    } else {
      console.error("Failed to update product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <label className="block text-lg font-bold mb-2">Title</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 mb-4" />

      {/* Subtitle Input */}
      <label className="block text-lg font-bold mb-2">Subtitle</label>
      <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border p-2 mb-4" />

      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill value={description} onChange={setDescription} className="mb-4" theme="snow" />

      <label className="block text-lg font-bold mb-2">Service Title 1</label>
      <input
        type="text"
        value={tservice1}
        onChange={(e) => setTService1(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {service1.map((s, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Title"
            value={s.title}
            onChange={(e) => handleServiceChange(index, "title", e.target.value, setService1)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={s.desc}
            onChange={(e) => handleServiceChange(index, "desc", e.target.value, setService1)}
            className="border p-2 w-full"
          />
          <button type="button" onClick={() => handleRemoveService(index, setService1)} className="bg-red-500 text-white px-2">-</button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddService(setService1)} className="bg-blue-500 text-white px-4 py-2 mb-4">+ Add Service</button>

      <label className="block text-lg font-bold mb-2">Service Title 2</label>
      <input
        type="text"
        value={tservice2}
        onChange={(e) => setTService2(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {service2.map((s, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Title"
            value={s.title}
            onChange={(e) => handleServiceChange(index, "title", e.target.value, setService2)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={s.desc}
            onChange={(e) => handleServiceChange(index, "desc", e.target.value, setService2)}
            className="border p-2 w-full"
          />
          <button type="button" onClick={() => handleRemoveService(index, setService2)} className="bg-red-500 text-white px-2">-</button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddService(setService2)} className="bg-blue-500 text-white px-4 py-2 mb-4">+ Add Service</button>

      <label className="block text-lg font-bold mb-2">Last</label>
      <ReactQuill value={last} onChange={setLast} className="mb-4" theme="snow" />

      <Upload onFilesUpload={setImg} />

      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}
