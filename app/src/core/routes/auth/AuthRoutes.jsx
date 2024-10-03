import Login from "../../../pages/user/auth/Login"
import Register from "../../../pages/user/auth/Register"

export const AuthRoutes = [
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "register",
		element: <Register />,
	},
]
