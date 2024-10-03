import React, { useEffect, useState } from "react"
import MainLayout from "../../../components/admin/layouts/MainLayout"
import { Navigate, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import LoadingPage from "../../../components/common/LoadingPage"
import axios from "axios"
import { fetchAuthStatus } from "../../services/auth"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

function ProtectedAdminRoute() {
	const navigate = useNavigate()

	// Check authentication status
	const { data: authenticated, isLoading } = useQuery({
		queryKey: ["authStatus"],
		queryFn: fetchAuthStatus,
	})

	const token = Cookies.get("auth_token")

	useEffect(() => {
		const requestInterceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response.status === 401) {
					Swal.fire(
						"Unauthorized",
						error.response.data.message,
						"warning"
					).then(() => {
						token ? navigate("/") : navigate("/login")
					})
				} else if (error.response.status === 403) {
					Swal.fire("Forbidden", error.response.data.message, "warning").then(
						() => {
							token ? navigate("/403") : navigate("/login")
						}
					)
				} else if (error.response.status === 404) {
					Swal.fire("404 Error", "Url/Page Not Found", "warning").then(() => {
						token ? navigate("/404") : navigate("/login")
					})
				}
				return Promise.reject(error)
			}
		)

		// Cleanup the interceptor on component unmount
		return () => {
			axios.interceptors.response.eject(requestInterceptor)
		}
	}, [navigate])

	// Return loading screen if still loading
	if (isLoading) {
		return <LoadingPage />
	}

	// If authenticated, show the protected content
	if (authenticated) {
		return <MainLayout />
	}

	// Swal.fire("Unauthorized", "Unauthenticated", "warning").then(() => {
	// 	navigate("/")
	// })

	return null // Fallback return to avoid rendering anything if Swal is showing
}

export default ProtectedAdminRoute
