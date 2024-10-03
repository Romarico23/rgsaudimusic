import { Navigate } from "react-router-dom"
import Dashboard from "../../../pages/admin/Dashboard"
import AddCategory from "../../../pages/admin/category/AddCategory"
import ViewCategory from "../../../pages/admin/category/ViewCategory"
import AddProduct from "../../../pages/admin/product/AddProduct"
import ViewProduct from "../../../pages/admin/product/ViewProduct"
import Profile from "../../../pages/admin/Profile"
import EditCategory from "../../../pages/admin/category/EditCategory"
import EditProduct from "../../../pages/admin/product/EditProduct"
import Order from "../../../pages/admin/order/Order"
import EditOrder from "../../../pages/admin/order/EditOrder"

export const AdminRoutes = [
	{ index: true, element: <Navigate to="/admin/dashboard" /> },
	{
		path: "dashboard",
		element: <Dashboard />,
	},
	{
		path: "add-category",
		element: <AddCategory />,
	},
	{
		path: "view-category",
		element: <ViewCategory />,
	},
	{
		path: "edit-category/:id",
		element: <EditCategory />,
	},
	{
		path: "add-product",
		element: <AddProduct />,
	},
	{
		path: "view-product",
		element: <ViewProduct />,
	},
	{
		path: "edit-product/:id",
		element: <EditProduct />,
	},
	{
		path: "profile",
		element: <Profile />,
	},
	{
		path: "order",
		element: <Order />,
	},
	{
		path: "edit-order/:id",
		element: <EditOrder />,
	},
]
