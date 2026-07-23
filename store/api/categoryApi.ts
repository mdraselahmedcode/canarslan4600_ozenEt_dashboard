import { baseApi } from "./baseApi";

export interface CategoryData {
  _id: string;
  name: string;
  image: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  totalProduct?: number;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    result: CategoryData[];
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: CategoryData;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      CategoriesResponse,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", String(params.page));
          if (params.limit) queryParams.append("limit", String(params.limit));
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        }
        const queryString = queryParams.toString();
        return {
          url: `/category/all-categories${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map(({ _id }) => ({ type: "Category" as const, id: _id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    getSingleCategory: builder.query<SingleCategoryResponse, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<SingleCategoryResponse, FormData>({
      query: (formData) => ({
        url: "/category/create-category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      SingleCategoryResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/category/update-category/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<SingleCategoryResponse, string>({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
