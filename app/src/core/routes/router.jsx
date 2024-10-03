import { createBrowserRouter } from "react-router-dom"
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute"
import { PublicRoutes } from "./public/PublicRoutes"
import { AuthRoutes } from "./auth/AuthRoutes"
import ProtectedAuthRoute from "./auth/ProtectedAuthRoute"
import { AdminRoutes } from "./admin/AdminRoutes"
import Page403 from "../../components/common/Page403"
import Page404 from "../../components/common/Page404"
import MainLayout from "../../components/user/layouts/MainLayout"

export const router = createBrowserRouter([
	{
		path: "admin",
		element: <ProtectedAdminRoute />,
		children: [...AdminRoutes],
	},
	{
		element: <MainLayout />,
		children: [...PublicRoutes],
	},
	{
		element: <ProtectedAuthRoute />,
		children: [...AuthRoutes],
	},
	{
		path: "403",
		element: <Page403 />,
	},
	{
		path: "*",
		element: <Page404 />,
	},
	{
		path: "404",
		element: <Page404 />,
	},
])
