import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import Swal from "sweetalert2"
import Cookies from "js-cookie"

// Function to get the access token from cookies
const getAccessToken = () => {
	return Cookies.get("auth_token")
}

// Function to check if the user is authenticated
const isAuthenticated = () => {
	return !!getAccessToken()
}

function ProtectedPublicRoute() {
	if (!isAuthenticated()) {
		Swal.fire({
			title: "Access Denied",
			text: "You need to log in to access this page.",
			icon: "error",
			confirmButtonText: "Login",
		})
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}

export default ProtectedPublicRoute
