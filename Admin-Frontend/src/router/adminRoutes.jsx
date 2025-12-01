import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import AdminForgotPasswordPage from "../pages/auth/AdminForgotPasswordPage";
import AdminKakaoCompletePage from "../pages/auth/AdminKakaoCompletePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminCouponListPage from "../pages/admin/AdminCouponListPage";
import AdminCouponCreatePage from "../pages/admin/AdminCouponCreatePage";
import AdminCouponEditPage from "../pages/admin/AdminCouponEditPage";
import AdminBusinessManagementPage from "../pages/admin/AdminBusinessManagementPage";
import AdminStatisticsPage from "../pages/admin/AdminStatisticsPage";
import AdminReviewListPage from "../pages/admin/AdminReviewListPage";
import AdminReviewDetailPage from "../pages/admin/AdminReviewDetailPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminMyProfilePage from "../pages/admin/AdminMyProfilePage";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";

const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPasswordPage />,
  },
  {
    path: "/admin/kakao/complete",
    element: <AdminKakaoCompletePage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminUserManagementPage />,
      },
      {
        path: "coupons",
        element: <AdminCouponListPage />,
      },
      {
        path: "coupons/create",
        element: <AdminCouponCreatePage />,
      },
      {
        path: "coupons/:id/edit",
        element: <AdminCouponEditPage />,
      },
      {
        path: "owners",
        element: <AdminBusinessManagementPage />,
      },
      {
        path: "statistics",
        element: <AdminStatisticsPage />,
      },
      {
        path: "reviews",
        element: <AdminReviewListPage />,
      },
      {
        path: "reviews/:id",
        element: <AdminReviewDetailPage />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "profile",
        element: <AdminMyProfilePage />,
      },
    ],
  },
];

export default adminRoutes;

