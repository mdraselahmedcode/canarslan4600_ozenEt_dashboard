"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  PenIcon,
  DeleteIcon,
  ImageFileIcon,
} from "@/components/icons";

export interface Product {
  id: string;
  name: string;
  category: "Beef" | "Chicken" | "Lamb" | "Frozen" | "Processed Meats";
  defaultPrice: number;
  unit: string;
  packSize: string;
  availability: "In Stock" | "Limited" | "Out of Stock";
  description: string;
  image: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Beef Tenderloin",
    category: "Beef",
    defaultPrice: 38.5,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Premium tender beef cut from the loin, perfect for pan-searing or grilling.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
  },
  {
    id: "2",
    name: "Diced Beef",
    category: "Beef",
    defaultPrice: 29.8,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Fresh beef cut into bite-sized cubes. Perfect for stews, casseroles, and kababs.",
    image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Ground Beef",
    category: "Beef",
    defaultPrice: 24.9,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Freshly ground beef with a lean-to-fat ratio ideal for burgers, meatballs, and sauces.",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6e946a88a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "Ribeye Steak",
    category: "Beef",
    defaultPrice: 42.0,
    unit: "kg",
    packSize: "250g / portion",
    availability: "Limited",
    description: "Highly marbled ribeye cut providing rich flavor and tender texture.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=600",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Beef Chops",
    category: "Beef",
    defaultPrice: 35.6,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Bone-in beef chops with excellent marbling for grilling or slow-roasting.",
    image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    name: "Chicken Breast",
    category: "Chicken",
    defaultPrice: 11.2,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Lean and tender boneless skinless chicken breasts, ideal for a wide variety of meals.",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
  },
  {
    id: "7",
    name: "Whole Chicken",
    category: "Chicken",
    defaultPrice: 9.8,
    unit: "each",
    packSize: "1.5-2 kg / each",
    availability: "In Stock",
    description: "Whole fresh chicken, perfect for roasting, rotisserie, or preparing soups.",
    image: "https://images.unsplash.com/photo-1587593817642-8b98df728645?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "8",
    name: "Chicken Thighs",
    category: "Chicken",
    defaultPrice: 10.5,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Juicy bone-in chicken thighs, great for baking, slow cooking, or BBQ.",
    image: "https://images.unsplash.com/photo-1606728035253-49e196302c42?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "9",
    name: "Chicken Wings",
    category: "Chicken",
    defaultPrice: 8.9,
    unit: "kg",
    packSize: "1 kg",
    availability: "In Stock",
    description: "Fresh chicken wings, perfect for deep frying or baking with hot sauce.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600",
    isNew: true,
  },
  {
    id: "10",
    name: "Lamb Leg",
    category: "Lamb",
    defaultPrice: 54.0,
    unit: "each",
    packSize: "2-3 kg / each",
    availability: "In Stock",
    description: "Succulent bone-in lamb leg, highly tender and perfect for holiday roasting.",
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
  },
  {
    id: "11",
    name: "Lamb Shoulder",
    category: "Lamb",
    defaultPrice: 49.5,
    unit: "each",
    packSize: "1.5-2 kg / each",
    availability: "In Stock",
    description: "Richly flavored lamb shoulder, ideal for slow roasting or braising.",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "12",
    name: "Lamb Ribs",
    category: "Lamb",
    defaultPrice: 46.0,
    unit: "kg",
    packSize: "1 kg",
    availability: "Limited",
    description: "Tender lamb rib chops with a deep, rich flavor profile for quick grilling.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "13",
    name: "Frozen Beef",
    category: "Frozen",
    defaultPrice: 22.5,
    unit: "case",
    packSize: "5 kg / case",
    availability: "In Stock",
    description: "Frozen wholesale cuts of beef, blast-frozen to seal freshness and texture.",
    image: "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "14",
    name: "Frozen Chicken Breast",
    category: "Frozen",
    defaultPrice: 7.8,
    unit: "case",
    packSize: "10 kg / case",
    availability: "In Stock",
    description: "Individually quick frozen chicken breasts in bulk packaging.",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "15",
    name: "Frozen Lamb",
    category: "Frozen",
    defaultPrice: 41.0,
    unit: "case",
    packSize: "5 kg / case",
    availability: "Out of Stock",
    description: "Wholesale frozen lamb cuts, preserved in optimal cold conditions.",
    image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "16",
    name: "Beef Sausage",
    category: "Processed Meats",
    defaultPrice: 22.8,
    unit: "each",
    packSize: "500 g / each",
    availability: "In Stock",
    description: "Fresh beef sausages spiced with traditional Turkish herbs.",
    image: "https://images.unsplash.com/photo-1541048611353-a66f8b32f917?auto=format&fit=crop&q=80&w=600",
    isFeatured: true,
  },
  {
    id: "17",
    name: "Butcher's Meatballs",
    category: "Processed Meats",
    defaultPrice: 20.0,
    unit: "pack",
    packSize: "1 kg / pack",
    availability: "In Stock",
    description: "Classic Turkish butcher meatballs (kofte) prepared with onions and species.",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "18",
    name: "Cured Beef (Pastirma)",
    category: "Processed Meats",
    defaultPrice: 38.0,
    unit: "each",
    packSize: "200 g / each",
    availability: "In Stock",
    description: "Highly seasoned, air-dried cured beef coated in garlic cumin paste.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    isNew: true,
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add/Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Beef");
  const [availability, setAvailability] = useState<Product["availability"]>("In Stock");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [packSize, setPackSize] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("ozenet_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      localStorage.setItem("ozenet_products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }
  }, []);

  // Save list to localstorage helper
  const saveToLocalStorage = (list: Product[]) => {
    localStorage.setItem("ozenet_products", JSON.stringify(list));
    setProducts(list);
  };

  const handleAddClick = () => {
    setModalMode("add");
    setEditingProduct(null);
    setName("");
    setCategory("Beef");
    setAvailability("In Stock");
    setDefaultPrice("");
    setUnit("kg");
    setPackSize("");
    setDescription("");
    setProductImage(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (p: Product) => {
    setModalMode("edit");
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setAvailability(p.availability);
    setDefaultPrice(String(p.defaultPrice));
    setUnit(p.unit);
    setPackSize(p.packSize);
    setDescription(p.description);
    setProductImage(p.image);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      const updated = products.filter((p) => p.id !== deletingProductId);
      saveToLocalStorage(updated);
    }
    setIsDeleteModalOpen(false);
    setDeletingProductId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingProductId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
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
    if (!name.trim() || !defaultPrice) {
      alert("Name and Price are required.");
      return;
    }

    const priceNum = parseFloat(defaultPrice);
    if (isNaN(priceNum)) {
      alert("Price must be a valid number.");
      return;
    }

    const finalImage =
      previewUrl ||
      productImage ||
      "https://images.unsplash.com/photo-1588168333986-5078647aa981?auto=format&fit=crop&q=80&w=600";

    if (modalMode === "add") {
      const newProduct: Product = {
        id: String(Date.now()),
        name,
        category,
        defaultPrice: priceNum,
        unit,
        packSize: packSize || "1 kg",
        availability,
        description: description || "Fresh meat product, processed under strict quality controls.",
        image: finalImage,
      };
      const updated = [...products, newProduct];
      saveToLocalStorage(updated);
    } else if (modalMode === "edit" && editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name,
              category,
              defaultPrice: priceNum,
              unit,
              packSize,
              availability,
              description,
              image: finalImage,
            }
          : p
      );
      saveToLocalStorage(updated);
    }

    closeModal();
  };

  // Stats Counters
  const countInStock = products.filter((p) => p.availability === "In Stock").length;
  const countLimited = products.filter((p) => p.availability === "Limited").length;
  const countOutOfStock = products.filter((p) => p.availability === "Out of Stock").length;

  // Filtered List
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || p.availability === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-nunito-bold text-slate-800">Products</h1>
          <p className="text-sm font-nunito text-slate-500 mt-1">
            {products.length} products across 5 categories
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
              <option value="Beef">Beef</option>
              <option value="Chicken">Chicken</option>
              <option value="Lamb">Lamb</option>
              <option value="Frozen">Frozen</option>
              <option value="Processed Meats">Processed Meats</option>
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

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
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
                        <img
                          src={p.image}
                          alt={p.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-nunito-bold text-slate-700">
                            {p.name}
                          </span>
                          {p.isNew && (
                            <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] text-[8px] font-bold uppercase rounded-md px-1.5 py-0.5 scale-90">
                              NEW
                            </span>
                          )}
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
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product["category"])}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <option value="Beef">Beef</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Lamb">Lamb</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Processed Meats">Processed Meats</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-nunito-bold text-slate-500 uppercase tracking-wider mb-2">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as Product["availability"])}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited">Limited</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
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
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none rounded-xl text-sm font-nunito text-slate-600 bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <option value="kg">kg</option>
                    <option value="each">each</option>
                    <option value="pack">pack</option>
                    <option value="case">case</option>
                    <option value="portion">portion</option>
                  </select>
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
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-sm font-nunito-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-brand-primary/10 active:scale-[0.98]"
              >
                {modalMode === "add" ? "Add Product" : "Update Product"}
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
                  {products.find((p) => p.id === deletingProductId)?.name}
                </span>
                ? This action cannot be undone.
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
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
