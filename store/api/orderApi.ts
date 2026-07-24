import { baseApi } from "./baseApi";

export interface CustomerData {
  _id: string;
  email: string;
  name: string;
  phone: string;
  profile_image: string;
}

export interface OrderItemData {
  product: string;
  category: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  packSize: string;
  quantity: number;
  itemSubTotal: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StatusHistoryEntry {
  status: string;
  changedBy: string;
  note: string;
  changedAt: string;
  _id?: string;
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  customer: CustomerData;
  items: OrderItemData[];
  shippingAddress: ShippingAddress;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  totalPrice: number;
  status: "received" | "confirmed" | "preparing" | "delivered" | "cancelled" | "rejected";
  note?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    result: OrderData[];
  };
}

export interface SingleOrderResponse {
  success: boolean;
  message: string;
  data: OrderData;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<
      OrdersResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        paymentStatus?: string;
        customer?: string;
        searchTerm?: string;
        sort?: string;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page !== undefined) queryParams.append("page", String(params.page));
          if (params.limit !== undefined) queryParams.append("limit", String(params.limit));
          if (params.status && params.status !== "All") {
            queryParams.append("status", params.status);
          }
          if (params.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);
          if (params.customer) queryParams.append("customer", params.customer);
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
          if (params.sort) queryParams.append("sort", params.sort);
        }
        const queryString = queryParams.toString();
        return {
          url: `/order/all-orders${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map(({ _id }) => ({ type: "Order" as const, id: _id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    getSingleOrder: builder.query<SingleOrderResponse, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<
      SingleOrderResponse,
      { id: string; status: string; note?: string }
    >({
      query: ({ id, status, note }) => ({
        url: `/order/update-status/${id}`,
        method: "PATCH",
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
