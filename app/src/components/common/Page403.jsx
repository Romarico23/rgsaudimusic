import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Page403() {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/")
		}, 5000)

		return () => clearTimeout(timer)
	}, [navigate])

	useEffect(() => {
		document.title = "Page403"
	}, [])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Page 403 | Forbidden</h1>
			<p className="text-lg">
				Access Denied! You do not have the necessary permissions.
			</p>
		</div>
	)
}

export default Page403
