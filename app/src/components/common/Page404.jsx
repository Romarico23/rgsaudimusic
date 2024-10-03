import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Page404() {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/")
		}, 5000)

		return () => clearTimeout(timer)
	}, [navigate])

	useEffect(() => {
		document.title = "Page404"
	}, [])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold mb-4">Page 404 | Page Not Found</h1>
			<p className="text-lg">Url / Page you are searching not found</p>
		</div>
	)
}

export default Page404
