"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CategoriesIcon,
  PenIcon,
  DeleteIcon,
  ImageFileIcon,
} from "@/components/icons";

interface Category {
  id: string;
  name: string;
  image: string;
  productsCount: number;
}

const initialCategories: Category[] = [
  { id: "1", name: "Beef", image: "/images/cat_beef.jpg", productsCount: 5 },
  { id: "2", name: "Chicken", image: "/images/cat_chick.jpg", productsCount: 4 },
  { id: "3", name: "Lamb", image: "/images/cat_lamb.jpg", productsCount: 3 },
  { id: "4", name: "Frozen", image: "/images/cat_frozen.jpg", productsCount: 3 },
  { id: "5", name: "Processed Meats", image: "/images/cat_processed_meats.jpg", productsCount: 3 },
];

const getCategoryBadgeClass = (categoryName: string) => {
  switch (categoryName) {
    case "Beef":
      return "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]";
    case "Chicken":
      return "bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]";
    case "Lamb":
      return "bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]";
    case "Frozen":
      return "bg-[#ECFEFF] text-[#0891B2] border border-[#CFFAFE]";
    case "Processed Meats":
    case "Processed":
      return "bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF9C3]";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-100";
  }
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form States
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAddClick = () => {
    setModalMode("add");
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cat: Category) => {
    setModalMode("edit");
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryImage(cat.image);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCategoryId) {
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategoryId));
    }
    setIsDeleteModalOpen(false);
    setDeletingCategoryId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingCategoryId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    if (!categoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    const finalImage = previewUrl || categoryImage || "/images/cat_beef.jpg";

    if (modalMode === "add") {
      const newCat: Category = {
        id: String(Date.now()),
        name: categoryName,
        image: finalImage,
        productsCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    } else if (modalMode === "edit" && editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: categoryName, image: finalImage }
            : c
        )
      );
    }

    closeModal();
  };

  // Filter list
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Categories</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {categories.length} product categories
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
        >
          + Add Category
        </button>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 mb-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col items-center justify-center text-center hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 relative bg-slate-50 flex items-center justify-center shadow-inner">
              <Image
                src={cat.image}
                alt={cat.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-sm font-nunito-bold text-slate-800 leading-tight">
              {cat.name}
            </h3>
            <p className="text-[11px] font-nunito-medium text-slate-400 mt-1">
              {cat.productsCount} products
            </p>
          </div>
        ))}
      </div>

      {/* Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
          />
        </div>
        <div className="text-xs font-nunito text-slate-400">
          {filteredCategories.length} categories
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                  Products
                </th>
                <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-10">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/30 transition-all duration-150"
                >
                  {/* Category Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 relative shrink-0 shadow-sm">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-sm font-nunito-bold text-slate-700">
                        {cat.name}
                      </span>
                    </div>
                  </td>

                  {/* Products Count */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-nunito-bold text-slate-700">
                      {cat.productsCount}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right pr-10">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                        title="Edit Category"
                      >
                        <PenIcon size={12} color="currentColor" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat.id)}
                        className="w-8 h-8 rounded-lg border border-red-100 hover:bg-[#FEE2E2]/60 text-[#DC2626] flex items-center justify-center transition-colors cursor-pointer shadow-sm bg-[#FEF2F2]/50"
                        title="Delete Category"
                      >
                        <DeleteIcon size={12} color="currentColor" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50">
              <h2 className="text-lg font-nunito-bold text-slate-800">
                {modalMode === "add" ? "Add Category" : "Edit Category"}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Category Name Input */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beef, Chicken, Lamb"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Category Image Drag and Drop */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category Image
                </label>

                {previewUrl || categoryImage ? (
                  <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200 relative group flex items-center justify-center bg-slate-50 shadow-sm">
                    <img
                      src={previewUrl || categoryImage || ""}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
                      <button
                        type="button"
                        onClick={() => document.getElementById("category-file-input")?.click()}
                        className="px-3.5 py-2 bg-white text-slate-700 rounded-xl text-xs font-nunito-semibold shadow hover:bg-slate-50 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setCategoryImage(null);
                        }}
                        className="px-3.5 py-2 bg-[#FEF2F2] text-[#DC2626] rounded-xl text-xs font-nunito-semibold shadow hover:bg-[#FEE2E2] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("category-file-input")?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400 group-hover:text-slate-500 transition-colors shadow-sm bg-white">
                      <ImageFileIcon size={20} color="currentColor" />
                    </div>
                    <p className="text-sm font-nunito-semibold text-slate-700">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs font-nunito text-slate-400 mt-1">
                      PNG, JPG, WEBP up to 5 MB
                    </p>
                  </div>
                )}
                <input
                  id="category-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
              >
                {modalMode === "add" ? "Save Category" : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={cancelDelete}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50">
              <h2 className="text-lg font-nunito-bold text-slate-800">
                Delete Category
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm font-nunito text-slate-600">
                Are you sure you want to delete the category{" "}
                <span className="font-nunito-bold text-slate-800">
                  {categories.find((c) => c.id === deletingCategoryId)?.name}
                </span>
                ? This action cannot be undone and will affect associated products.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
