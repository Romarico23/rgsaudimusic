import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import LoadingPage from "../../../components/common/LoadingPage"

const ProtectedAuthRoute = () => {
	const [isLoading, setIsLoading] = useState(true)
	const token = Cookies.get("auth_token")
	const navigate = useNavigate()

	useEffect(() => {
		if (
			token &&
			(window.location.pathname === "/login" ||
				window.location.pathname === "/register")
		) {
			navigate("/", { replace: true })
		}
		setIsLoading(false)
	}, [])

	if (isLoading) {
		return <LoadingPage />
	}

	return <Outlet />
}

export default ProtectedAuthRoute
