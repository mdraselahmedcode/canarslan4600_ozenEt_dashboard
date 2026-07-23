import { baseApi } from "./baseApi";
import { CategoryData } from "./categoryApi";

export interface ProductData {
  _id: string;
  name: string;
  category: CategoryData;
  image: string;
  availability: "in_stock" | "out_of_stock" | "limited_stock";
  price: number;
  description: string;
  unit: "piece" | "per_kg" | "per_lb";
  packSize: string;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    result: ProductData[];
  };
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: ProductData;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      ProductsResponse,
      {
        page?: number;
        limit?: number;
        searchTerm?: string;
        category?: string;
        availability?: string;
        isFeatured?: boolean;
        sort?: string;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", String(params.page));
          if (params.limit) queryParams.append("limit", String(params.limit));
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
          if (params.category && params.category !== "All") {
            queryParams.append("category", params.category);
          }
          if (params.availability && params.availability !== "All") {
            queryParams.append("availability", params.availability);
          }
          if (params.isFeatured !== undefined) {
            queryParams.append("isFeatured", String(params.isFeatured));
          }
          if (params.sort) queryParams.append("sort", params.sort);
        }
        const queryString = queryParams.toString();
        return {
          url: `/product/all-products${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map(({ _id }) => ({ type: "Product" as const, id: _id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<SingleProductResponse, FormData>({
      query: (formData) => ({
        url: "/product/create-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      SingleProductResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/product/update-product/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    updateProductStatus: builder.mutation<SingleProductResponse, string>({
      query: (id) => ({
        url: `/product/update-product-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<SingleProductResponse, string>({
      query: (id) => ({
        url: `/product/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productApi;
