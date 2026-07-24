import { baseApi } from "./baseApi";

export interface UserStatus {
  _id: string;
  isBlocked: boolean;
  isActive: boolean;
}

export interface CustomerData {
  _id: string;
  user: UserStatus;
  address: string;
  businessAddress: string;
  businessName: string;
  businessType: string;
  createdAt: string;
  dateOfBirth?: string;
  email: string;
  isAdminVerified: boolean;
  name: string;
  phone: string;
  profile_image?: string;
  taxId?: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    result: CustomerData[];
  };
}

export interface SingleCustomerResponse {
  success: boolean;
  message: string;
  data: CustomerData;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
      CustomersResponse,
      {
        page?: number;
        limit?: number;
        searchTerm?: string;
        isBlocked?: boolean;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.append("page", String(params.page));
          if (params.limit !== undefined) queryParams.append("limit", String(params.limit));
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
          if (params.isBlocked !== undefined) queryParams.append("isBlocked", String(params.isBlocked));
        }
        const queryString = queryParams.toString();
        return {
          url: `/customer/get-all${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map(({ _id }) => ({ type: "Customer" as const, id: _id })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),
    getSingleCustomer: builder.query<SingleCustomerResponse, string>({
      query: (id) => ({
        url: `/customer/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    verifyCustomer: builder.mutation<
      any,
      { id: string; status: "approved" | "rejected"; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/customer/admin-verification/${id}`,
        method: "POST",
        body: { status, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customer/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useVerifyCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
