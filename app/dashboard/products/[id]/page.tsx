"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import {
  BackIcon,
  PenIcon,
  DeleteIcon,
  ImageFileIcon,
} from "@/components/icons";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  defaultPrice: number;
  unit: string;
  packSize: string;
  availability: "In Stock" | "Limited" | "Out of Stock";
  description: string;
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const { data: apiData, isLoading: isGetLoading } = useGetSingleProductQuery(id);
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const dbCategories = categoriesData?.data?.result || [];

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const product = useMemo(() => {
    if (!apiData?.data) return null;
    const p = apiData.data;
    return {
      id: p._id,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      categoryId: p.category?._id || "",
      defaultPrice: p.price,
      unit: p.unit,
      packSize: p.packSize,
      availability: p.availability === "in_stock" ? "In Stock" : p.availability === "limited_stock" ? "Limited" : "Out of Stock" as Product["availability"],
      description: p.description,
      image: p.image,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    };
  }, [apiData]);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<Product["availability"]>("In Stock");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [unit, setUnit] = useState("per_kg");
  const [packSize, setPackSize] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleEditClick = () => {
    if (!product) return;
    setName(product.name);
    setCategory(product.categoryId || "");
    setAvailability(product.availability);
    setDefaultPrice(String(product.defaultPrice));
    setUnit(product.unit);
    setPackSize(product.packSize);
    setDescription(product.description);
    setProductImage(product.image);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
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
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !defaultPrice || !product) {
      alert("Name and Price are required.");
      return;
    }

    const priceNum = parseFloat(defaultPrice);
    if (isNaN(priceNum)) {
      alert("Price must be a valid number.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("product_image", selectedFile);
      }
      formData.append(
        "data",
        JSON.stringify({
          name,
          category,
          availability: availability === "In Stock" ? "in_stock" : availability === "Limited" ? "limited_stock" : "out_of_stock",
          price: priceNum,
          description: description || "Fresh meat product",
          unit,
          packSize: packSize || "1 kg",
          isFeatured: product.isFeatured ?? true,
          isActive: product.isActive ?? true,
        })
      );

      const response = await updateProduct({
        id: product.id,
        formData,
      }).unwrap();

      if (response.success) {
        setIsEditModalOpen(false);
      } else {
        alert(response.message || "Failed to update product.");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err?.data?.message || err?.message || "An error occurred while updating.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      const response = await deleteProduct(product.id).unwrap();
      if (response.success) {
        setIsDeleteModalOpen(false);
        router.push("/dashboard/products");
      } else {
        alert(response.message || "Failed to delete product.");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.data?.message || err?.message || "An error occurred while deleting.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isGetLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
        <p className="text-slate-400 text-xs font-nunito mt-4">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center font-nunito">
        <p className="text-slate-500">Product not found.</p>
        <Link
          href="/dashboard/products"
          className="text-brand-primary mt-4 inline-block hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm bg-white"
          >
            <BackIcon width={16} height={16} color="currentColor" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-xl font-nunito-bold text-slate-800 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs font-nunito text-slate-400 mt-1">
              {`${product.category} • ${product.packSize}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {product.availability === "In Stock" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
              In Stock
            </span>
          )}
          {product.availability === "Limited" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
              Limited
            </span>
          )}
          {product.availability === "Out of Stock" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Two Columns Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Card & Action Buttons */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="w-full h-64 rounded-xl overflow-hidden mb-5 bg-slate-50 shadow-inner relative">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mb-6">
              <p className="text-2xl font-nunito-bold text-[#C4202B]">
                ${product.defaultPrice.toFixed(2)}/{product.unit}
              </p>
              <p className="text-xs font-nunito text-slate-400 mt-1">
                Pack Size: {product.packSize}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleEditClick}
                className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm shadow-brand-primary/10"
              >
                <PenIcon size={13} color="currentColor" />
                <span>Edit Product</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full py-3 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] rounded-xl font-nunito-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                <DeleteIcon size={13} color="currentColor" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-6">
              Product Information
            </h2>
            <div className="divide-y divide-slate-50 text-sm">
              <div className="flex justify-between py-3">
                <span className="font-nunito-medium text-slate-400">Category</span>
                <span className="font-nunito-bold text-slate-700">{product.category}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-nunito-medium text-slate-400">Unit</span>
                <span className="font-nunito-bold text-slate-700">{product.unit}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-nunito-medium text-slate-400">Pack Size</span>
                <span className="font-nunito-bold text-slate-700">{product.packSize}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-nunito-medium text-slate-400">Default Price</span>
                <span className="font-nunito-bold text-slate-700">
                  ${product.defaultPrice.toFixed(2)} per {product.unit}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-nunito-medium text-slate-400">Availability</span>
                <span className="font-nunito-bold text-slate-700">{product.availability}</span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-base font-nunito-bold text-slate-800 mb-4">
              Description
            </h2>
            <p className="text-sm font-nunito text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-100 bg-white z-10"
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
                Edit Product
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Product Photo */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Product Photo
                </label>
                {previewUrl || productImage ? (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 relative group flex items-center justify-center bg-slate-50 shadow-sm">
                    <img
                      src={previewUrl || productImage || ""}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
                      <button
                        type="button"
                        onClick={() => document.getElementById("product-detail-file-input")?.click()}
                        className="px-3.5 py-2 bg-white text-slate-700 rounded-xl text-xs font-nunito-semibold shadow hover:bg-slate-50 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setProductImage(null);
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
                    onClick={() => document.getElementById("product-detail-file-input")?.click()}
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
                  id="product-detail-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beef Tenderloin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Category & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                    >
                      {dbCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                    Availability
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as Product["availability"])}
                      className="appearance-none w-full pl-4 pr-10 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Limited">Limited</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <div className="absolute right-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                    Default Price ($) *
                  </label>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                    Unit
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                    >
                      <option value="piece">piece</option>
                      <option value="per_kg">per kg</option>
                      <option value="per_lb">per lb</option>
                    </select>
                    <div className="absolute right-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pack Size */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pack Size / Weight
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 kg, 5 kg / case"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Update Product"}
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
              onClick={() => setIsDeleteModalOpen(false)}
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
                Delete Product
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm font-nunito text-slate-600">
                Are you sure you want to delete the product{" "}
                <span className="font-nunito-bold text-slate-800">{product.name}</span>?
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSaving}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
