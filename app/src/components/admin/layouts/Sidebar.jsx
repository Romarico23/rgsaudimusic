import React, { useState } from "react"
import { BiHome } from "react-icons/bi"
import { GoListUnordered } from "react-icons/go"
import { IoIosLogOut, IoMdAddCircleOutline } from "react-icons/io"
import {
	MdOutlineCategory,
	MdOutlinePreview,
	MdOutlineProductionQuantityLimits,
} from "react-icons/md"
import { RiProfileLine } from "react-icons/ri"
import { NavLink } from "react-router-dom"
import DropdownButton from "../DropdownButton"
import { useLogoutMutation } from "../../../core/hooks/useLogoutMutation"
import { HiOutlineMenuAlt3 } from "react-icons/hi"

function Sidebar() {
	const [isOpen, setIsOpen] = useState(false) // State to track sidebar open/close

	const mutation = useLogoutMutation()

	const handleLogout = async () => {
		mutation.mutate()
	}

	// Toggle sidebar visibility
	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	return (
		<>
			<div
				className={`flex flex-col fixed z-50 top-0 left-0 w-64 min-h-screen lg:static bg-white shadow-blue-300 shadow-lg transform duration-300 ease-in-out
			${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
			>
				{/* Close button in the middle of the sidebar */}
				<button
					className="absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 p-2 rounded-full text-white lg:hidden"
					onClick={toggleSidebar}
				>
					<HiOutlineMenuAlt3 size={30} />
				</button>

				<h1 className="py-10 px-10 text-2xl font-bold">RG'S Audimusic</h1>

				<div className="flex flex-col flex-grow">
					<div className="py-10 flex flex-col">
						<NavLink
							to="/admin/dashboard"
							className="text-xl pl-10 py-2 flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
							onClick={() => setIsOpen(false)}
							style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						>
							<BiHome />
							<h1>Dashboard</h1>
						</NavLink>
						<DropdownButton
							icon={<MdOutlineCategory />}
							title="Category"
							items={[
								{
									to: "/admin/add-category",
									label: "Add Category",
									icon: <IoMdAddCircleOutline />,
									onClick: () => setIsOpen(false),
								},
								{
									to: "/admin/view-category",
									label: "View Category",
									icon: <MdOutlinePreview />,
									onClick: () => setIsOpen(false),
								},
							]}
						/>
						<DropdownButton
							icon={<MdOutlineProductionQuantityLimits />}
							title="Products"
							items={[
								{
									to: "/admin/add-product",
									label: "Add Product",
									icon: <IoMdAddCircleOutline />,
									onClick: () => setIsOpen(false),
								},
								{
									to: "/admin/view-product",
									label: "View Product",
									icon: <MdOutlinePreview />,
									onClick: () => setIsOpen(false),
								},
							]}
						/>
						<NavLink
							to="/admin/order"
							className="text-xl pl-10 py-2 flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
							style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
							onClick={() => setIsOpen(false)}
						>
							<GoListUnordered />
							<h1>Order</h1>
						</NavLink>
						<NavLink
							to="/admin/profile"
							className="text-xl pl-10 py-2 flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
							style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
							onClick={() => setIsOpen(false)}
						>
							<RiProfileLine />
							<h1>Profile</h1>
						</NavLink>
					</div>
				</div>

				<div className="border-t-2 border-gray-400">
					<button
						onClick={handleLogout}
						disabled={mutation.isPending}
						className="text-xl w-full pl-10 py-2 flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
					>
						<IoIosLogOut />
						<h1>{mutation.isPending ? "Loading..." : "Logout"}</h1>
					</button>
				</div>
			</div>

			{/* Overlay for smaller screens when the sidebar is open */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
					onClick={toggleSidebar}
				/>
			)}
		</>
	)
}

export default Sidebar
