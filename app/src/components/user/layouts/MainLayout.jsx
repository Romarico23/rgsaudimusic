import React from "react"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import { countVisit } from "../../../core/services/api"
import { useMutation } from "@tanstack/react-query"

const EXPIRATION_TIME = 30 * 60 * 1000 // 30 minutes

function MainLayout() {
	const mutation = useMutation({
		mutationFn: countVisit,
		onSuccess: (data) => {
			console.log("User visit tracked successfully:", data.message)
		},
		onError: (error) => {
			console.error("Error tracking user visit:", error)
		},
	})

	// Check if the visit has already been recorded in this session
	const visitData = JSON.parse(sessionStorage.getItem("visitData"))
	const now = new Date().getTime()

	// Trigger mutation if visit is new or expired
	if (!visitData || now > visitData.expiration) {
		console.log("Recording visit...")
		mutation.mutate() // Trigger the mutation to count the visit

		// Set the flag and expiration time
		sessionStorage.setItem(
			"visitData",
			JSON.stringify({
				counted: true,
				expiration: now + EXPIRATION_TIME,
			})
		)
	} else {
		console.log("Visit already counted and not expired.")
	}

	return (
		<div className="flex h-screen ">
			<div className=" flex-1">
				<Navbar />
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default MainLayout
