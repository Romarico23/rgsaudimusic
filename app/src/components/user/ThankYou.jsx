import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function ThankYou() {
	const navigate = useNavigate()

	// Redirect to homepage after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/")
		}, 5000) // 5000 milliseconds = 5 seconds

		// Cleanup the timer if the component is unmounted before the timeout
		return () => clearTimeout(timer)
	}, [navigate])

	useEffect(() => {
		document.title = "Thank You"
	}, [])

	return (
		<div className="flex items-center justify-center min-h-screen">
			<h1 className="text-xl font-bold">Thank You For Your Order</h1>
		</div>
	)
}

export default ThankYou
