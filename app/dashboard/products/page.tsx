"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "@/store/api/productApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi";
import {
  EyeIcon,
  PenIcon,
  DeleteIcon,
  ImageFileIcon,
} from "@/components/icons";

export interface Product {
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

const mapUiStatusToApi = (uiStatus: string) => {
  if (uiStatus === "In Stock") return "in_stock";
  if (uiStatus === "Limited") return "limited_stock";
  if (uiStatus === "Out of Stock") return "out_of_stock";
  return uiStatus;
};

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isSaving, setIsSaving] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter]);

  // RTK Queries
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const dbCategories = categoriesData?.data?.result || [];

  const { data: apiData, isLoading: isGetLoading } = useGetAllProductsQuery({
    page,
    limit,
    searchTerm: debouncedSearch,
    category: categoryFilter === "All" ? undefined : categoryFilter,
    availability: statusFilter === "All" ? undefined : mapUiStatusToApi(statusFilter),
  });

  // Query all to calculate exact counts across the whole database
  const { data: allProductsData } = useGetAllProductsQuery({ limit: 1000 });
  const allProductsList = allProductsData?.data?.result || [];

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  // Add/Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const categories: Product[] = useMemo(() => {
    return (apiData?.data?.result || []).map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      categoryId: p.category?._id || "",
      defaultPrice: p.price,
      unit: p.unit,
      packSize: p.packSize,
      availability: p.availability === "in_stock" ? "In Stock" : p.availability === "limited_stock" ? "Limited" : "Out of Stock",
      description: p.description,
      image: p.image,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    }));
  }, [apiData]);

  const meta = apiData?.data?.meta;
  const totalItems = meta?.total || 0;
  const totalPages = meta?.totalPage || 1;
  const currentPage = meta?.page || 1;

  const handleAddClick = () => {
    setModalMode("add");
    setEditingProduct(null);
    setName("");
    setCategory(dbCategories[0]?._id || "");
    setAvailability("In Stock");
    setDefaultPrice("");
    setUnit("per_kg");
    setPackSize("");
    setDescription("");
    setProductImage(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (p: Product) => {
    setModalMode("edit");
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.categoryId || "");
    setAvailability(p.availability);
    setDefaultPrice(String(p.defaultPrice));
    setUnit(p.unit);
    setPackSize(p.packSize);
    setDescription(p.description);
    setProductImage(p.image);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingProductId) {
      setIsSaving(true);
      try {
        const response = await deleteProduct(deletingProductId).unwrap();
        if (!response.success) {
          alert(response.message || "Failed to delete product.");
        }
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(err?.data?.message || err?.message || "An error occurred while deleting.");
      } finally {
        setIsSaving(false);
        setIsDeleteModalOpen(false);
        setDeletingProductId(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingProductId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPreviewUrl(null);
    setSelectedFile(null);
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

  const handleToggleStatus = async (id: string) => {
    try {
      await updateProductStatus(id).unwrap();
    } catch (err: any) {
      console.error("Toggle status error:", err);
      alert(err?.data?.message || err?.message || "Failed to update product status.");
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !defaultPrice) {
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
          isFeatured: editingProduct ? editingProduct.isFeatured : true,
          isActive: editingProduct ? editingProduct.isActive : true,
        })
      );

      if (modalMode === "add") {
        const response = await createProduct(formData).unwrap();
        if (response.success) {
          closeModal();
        } else {
          alert(response.message || "Failed to create product.");
        }
      } else if (modalMode === "edit" && editingProduct) {
        const response = await updateProduct({
          id: editingProduct.id,
          formData,
        }).unwrap();
        if (response.success) {
          closeModal();
        } else {
          alert(response.message || "Failed to update product.");
        }
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err?.data?.message || err?.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Stats Counters
  const countInStock = allProductsList.filter((p) => p.availability === "in_stock").length;
  const countLimited = allProductsList.filter((p) => p.availability === "limited_stock").length;
  const countOutOfStock = allProductsList.filter((p) => p.availability === "out_of_stock").length;

  // Filtered List is mapped to the categories array directly
  const filteredProducts = categories;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Products</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {totalItems} products across {dbCategories.length} categories
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
        >
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* In Stock */}
        <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-3xl font-nunito-bold text-[#16A34A] leading-tight">
            {countInStock}
          </p>
          <p className="text-xs font-nunito-semibold text-slate-500 mt-2">In Stock</p>
        </div>

        {/* Limited Stock */}
        <div className="bg-amber-50/30 border border-amber-100/50 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-3xl font-nunito-bold text-[#D97706] leading-tight">
            {countLimited}
          </p>
          <p className="text-xs font-nunito-semibold text-slate-500 mt-2">Limited Stock</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-red-50/30 border border-red-100/50 rounded-2xl p-5 flex flex-col justify-between">
          <p className="text-3xl font-nunito-bold text-[#DC2626] leading-tight">
            {countOutOfStock}
          </p>
          <p className="text-xs font-nunito-semibold text-slate-500 mt-2">Out of Stock</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-700 bg-white transition-all shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-nunito transition-all shadow-sm"
            >
              <option value="All">All Categories</option>
              {dbCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Availability Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer font-nunito transition-all shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Limited">Limited</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-xs font-nunito text-slate-400">
          {filteredProducts.length} products
        </div>
      </div>

      {isGetLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-primary"></div>
          <p className="text-slate-400 text-xs font-nunito mt-4">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <p className="text-slate-400 text-sm font-nunito">No products found.</p>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider pl-4">
                      Product
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-6">
                      Default Price
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                      Pack Size
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                      Availability
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-nunito-bold text-slate-400 uppercase tracking-wider text-right pr-8">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/30 transition-all duration-150"
                    >
                      {/* Product Info */}
                      <td className="px-6 py-4 pl-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 relative shrink-0 shadow-sm">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageFileIcon size={16} color="currentColor" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-nunito-bold text-slate-700">
                                {p.name}
                              </span>
                              {p.isFeatured && (
                                <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] text-[8px] font-bold uppercase rounded-md px-1.5 py-0.5 scale-90">
                                  FEATURED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-nunito-semibold text-slate-500">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-right pr-6">
                        <span className="text-sm font-nunito-bold text-[#C4202B]">
                          ${p.defaultPrice.toFixed(2)}/{p.unit}
                        </span>
                      </td>

                      {/* Pack Size */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-nunito text-slate-500">
                          {p.packSize}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-6 py-4 text-center">
                        {p.availability === "In Stock" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-emerald-50 text-[#16A34A] border border-[#DCFCE7]">
                            In Stock
                          </span>
                        )}
                        {p.availability === "Limited" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-amber-50 text-[#D97706] border border-[#FEF3C7]">
                            Limited
                          </span>
                        )}
                        {p.availability === "Out of Stock" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-nunito-bold bg-red-50 text-[#DC2626] border border-[#FEE2E2]">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Active Status toggle switch */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(p.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            p.isActive
                              ? "bg-brand-primary"
                              : "bg-slate-200"
                          }`}
                          title={p.isActive ? "Deactivate Product" : "Activate Product"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              p.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right pr-8">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/dashboard/products/${p.id}`)}
                            className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                            title="View Details"
                          >
                            <EyeIcon size={12} color="currentColor" />
                          </button>
                          <button
                            onClick={() => handleEditClick(p)}
                            className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                            title="Edit Product"
                          >
                            <PenIcon size={12} color="currentColor" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.id)}
                            className="w-8 h-8 rounded-lg border border-red-100 hover:bg-[#FEE2E2]/60 text-[#DC2626] flex items-center justify-center transition-colors cursor-pointer shadow-sm bg-[#FEF2F2]/50"
                            title="Delete Product"
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

          {/* Pagination Footer */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm mt-4">
              {/* Left: Range and Info */}
              <div className="text-xs font-nunito-medium text-slate-500">
                Showing <span className="font-nunito-bold text-slate-700">{Math.min((currentPage - 1) * limit + 1, totalItems)}</span> to{" "}
                <span className="font-nunito-bold text-slate-700">{Math.min(currentPage * limit, totalItems)}</span> of{" "}
                <span className="font-nunito-bold text-slate-700">{totalItems}</span> entries
              </div>

              {/* Right: Controls & Limit Select */}
              <div className="flex items-center gap-6">
                {/* Limit Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-nunito-medium text-slate-500">Show:</span>
                  <div className="relative flex items-center">
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1); // Reset to page 1
                      }}
                      className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 focus:border-brand-primary focus:outline-none rounded-xl text-xs font-nunito-semibold text-slate-700 bg-white shadow-sm cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <div className="absolute right-2.5 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  {/* Prev Button */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                    title="Previous Page"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-nunito-bold transition-all duration-200 ${
                        p === currentPage
                          ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/10"
                          : "border border-slate-200 hover:bg-slate-50 text-slate-600 bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                    title="Next Page"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-100 relative mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={closeModal}
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
                {modalMode === "add" ? "Add Product" : "Edit Product"}
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
                        onClick={() => document.getElementById("product-file-input")?.click()}
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
                    onClick={() => document.getElementById("product-file-input")?.click()}
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
                  id="product-file-input"
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

              {/* Category & Availability row */}
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

              {/* Price & Unit row */}
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
                onClick={closeModal}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : modalMode === "add" ? "Add Product" : "Update Product"}
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
                Delete Product
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm font-nunito text-slate-600">
                Are you sure you want to delete the product{" "}
                <span className="font-nunito-bold text-slate-800">
                  {filteredProducts.find((p) => p.id === deletingProductId)?.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
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
