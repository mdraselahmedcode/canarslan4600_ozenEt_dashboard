import { baseApi } from "./baseApi";

export interface DashboardMeta {
  totalCustomer: number;
  unVerifiedCustomer: number;
  totalProduct: number;
  outOfStockProduct: number;
  totalOrder: number;
  pendingOrder: number;
  deliveredOrder: number;
  totalRevenue: number;
}

export interface DashboardMetaResponse {
  success: boolean;
  message: string;
  data: DashboardMeta;
}

export interface LegalInfo {
  _id: string;
  businessType: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  freeCancellationHour: number;
  jurisdiction: string;
  officialWebsite: string;
  platformFeePercentage: number;
  registeredAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalInfoResponse {
  success: boolean;
  message: string;
  data: LegalInfo;
}

export interface PolicyData {
  _id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyResponse {
  success: boolean;
  message: string;
  data: PolicyData;
}

export interface FaqData {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqResponse {
  success: boolean;
  message: string;
  data: FaqData;
}

export interface FaqsResponse {
  success: boolean;
  message: string;
  data: FaqData[];
}

export interface SupportTicket {
  _id: string;
  user?: {
    _id: string;
    email?: string;
    name?: string;
    profile_image?: string;
  } | string;
  userModel?: string;
  contactReason: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    result: SupportTicket[];
  };
}

export interface NotificationData {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
  data?: {
    entity: string;
    action: string;
    entityId: string;
    meta?: any;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
      unreadCount: number;
    };
    result: NotificationData[];
  };
}

export interface SimpleResponse {
  success: boolean;
  message: string;
  data: any;
}

export const metaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMeta: builder.query<DashboardMetaResponse, void>({
      query: () => ({
        url: "/meta/meta-data",
        method: "GET",
      }),
      providesTags: ["Customer", "Order", "Product"],
    }),
    getLegalInfo: builder.query<LegalInfoResponse, void>({
      query: () => ({
        url: "/legal-info/get",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    getPrivacyPolicy: builder.query<PolicyResponse, void>({
      query: () => ({
        url: "/manage/get-privacy-policy",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    addPrivacyPolicy: builder.mutation<PolicyResponse, { description: string }>({
      query: (body) => ({
        url: "/manage/add-privacy-policy",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    getTermsConditions: builder.query<PolicyResponse, void>({
      query: () => ({
        url: "/manage/get-terms-conditions",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    addTermsConditions: builder.mutation<PolicyResponse, { description: string }>({
      query: (body) => ({
        url: "/manage/add-terms-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    getFaqs: builder.query<FaqsResponse, void>({
      query: () => ({
        url: "/manage/get-faq",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    addFaq: builder.mutation<FaqResponse, { question: string; answer: string }>({
      query: (body) => ({
        url: "/manage/add-faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    editFaq: builder.mutation<FaqResponse, { id: string; question: string; answer: string }>({
      query: ({ id, ...body }) => ({
        url: `/manage/edit-faq/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteFaq: builder.mutation<FaqResponse, string>({
      query: (id) => ({
        url: `/manage/delete-faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    getSupportTickets: builder.query<SupportResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/support/get-all",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Customer"],
    }),
    getNotifications: builder.query<NotificationResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/notification/get-notifications",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Customer"],
    }),
    seeNotifications: builder.mutation<SimpleResponse, void>({
      query: () => ({
        url: "/notification/see-notifications",
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteNotification: builder.mutation<SimpleResponse, string>({
      query: (id) => ({
        url: `/notification/delete-notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    getBulkNotifications: builder.query<any, void>({
      query: () => ({
        url: "/bulk-notification/all",
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    createBulkNotification: builder.mutation<any, { title: string; message: string; targetAudience: string; selectedCustomers?: string[] }>({
      query: (body) => ({
        url: "/bulk-notification/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardMetaQuery,
  useGetLegalInfoQuery,
  useGetPrivacyPolicyQuery,
  useAddPrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useAddTermsConditionsMutation,
  useGetFaqsQuery,
  useAddFaqMutation,
  useEditFaqMutation,
  useDeleteFaqMutation,
  useGetSupportTicketsQuery,
  useGetNotificationsQuery,
  useSeeNotificationsMutation,
  useDeleteNotificationMutation,
  useGetBulkNotificationsQuery,
  useCreateBulkNotificationMutation,
} = metaApi;
