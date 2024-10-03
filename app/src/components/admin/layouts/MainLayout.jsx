import React from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"

function MainLayout() {
	return (
		<div className="min-h-screen flex">
			<Sidebar />
			<div className=" flex-1">
				<Navbar />
				<main className="flex-grow">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default MainLayout
