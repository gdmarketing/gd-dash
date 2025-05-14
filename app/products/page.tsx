"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Upload from "../components/Upload";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState(""); // Added subtitle state
  const [description, setDescription] = useState("");
  const [tservice1, setTService1] = useState("");
  const [service1, setService1] = useState([{ title: "", desc: "" }]);
  const [tservice2, setTService2] = useState("");
  const [service2, setService2] = useState([{ title: "", desc: "" }]);
  const [last, setLast] = useState("");
  const [img, setImg] = useState([""]);

  const handleAddField = (setter, currentData) => {
    setter([...currentData, { title: "", desc: "" }]);
  };

  const handleRemoveField = (setter, index, currentData) => {
    const updatedData = [...currentData];
    updatedData.splice(index, 1);
    setter(updatedData);
  };

  const handleChange = (setter, index, field, value) => {
    setter((prev) => {
      const newData = [...prev];
      newData[index][field] = value;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img.length === 1 && img[0] === "") {
      alert("Please choose at least 1 image");
      return;
    }

    const payload = {
      title,
      subtitle, // Include subtitle in payload
      description,
      tservice1,
      service1,
      tservice2,
      service2,
      last,
      img,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("added successfully!");
      window.location.href = "/dashboard";
    } else {
      alert("Failed to add");
    }
  };

  const handleImgChange = (url) => {
    if (url) {
      setImg(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      {/* Subtitle */}
      <input
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Description */}
      <label className="block text-lg font-bold mb-2">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write your description here..."
      />

      {/* Service 1 */}
      <input
        type="text"
        placeholder="Service 1 Title"
        value={tservice1}
        onChange={(e) => setTService1(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {service1.map((s, i) => (
        <div key={i} className="mb-2 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Title"
            value={s.title}
            onChange={(e) => handleChange(setService1, i, "title", e.target.value)}
            className="w-full border p-2 mb-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={s.desc}
            onChange={(e) => handleChange(setService1, i, "desc", e.target.value)}
            className="w-full border p-2 mb-2"
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveField(setService1, i, service1)}
            className="bg-red-500 text-white px-3 py-1"
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddField(setService1, service1)}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        + Add More
      </button>

      {/* Service 2 */}
      <input
        type="text"
        placeholder="Service 2 Title"
        value={tservice2}
        onChange={(e) => setTService2(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {service2.map((s, i) => (
        <div key={i} className="mb-2 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Title"
            value={s.title}
            onChange={(e) => handleChange(setService2, i, "title", e.target.value)}
            className="w-full border p-2 mb-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={s.desc}
            onChange={(e) => handleChange(setService2, i, "desc", e.target.value)}
            className="w-full border p-2 mb-2"
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveField(setService2, i, service2)}
            className="bg-red-500 text-white px-3 py-1"
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddField(setService2, service2)}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        + Add More
      </button>

      {/* Last Section */}
      <label className="block text-lg font-bold mb-2">Last Section</label>
      <ReactQuill
        value={last}
        onChange={setLast}
        className="mb-4"
        theme="snow"
        placeholder="Write the last section here..."
      />

      {/* Upload Images */}
      <Upload onFilesUpload={handleImgChange} />

      {/* Submit Button */}
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Save
      </button>
    </form>
  );
}
