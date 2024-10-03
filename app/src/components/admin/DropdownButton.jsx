import React, { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md"

function DropdownButton({ title, items, icon }) {
	const [isOpen, setIsOpen] = useState(false)

	const location = useLocation()

	// Check if any of the NavLink items are active
	const isAnyNavLinkActive = items.some((item) => item.to === location.pathname)

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div className="relative">
			<button
				className="text-xl pl-10 py-2 w-full flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
				style={{ color: isAnyNavLinkActive ? "#3b82f6" : "" }}
				onClick={toggleDropdown}
			>
				{icon}
				<h1>{title}</h1>
				<span
					className={`transform transition-transform ease-in-out duration-300 ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
				>
					{isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowRight />}
				</span>
			</button>
			<div
				className={`${
					isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
				} transition-all duration-300 ease-in-out overflow-hidden text-xl top-full w-full rounded-md shadow z-10`}
			>
				{items.map((item, index) => (
					<NavLink
						onClick={() => {
							item.onClick()
							setIsOpen(false)
						}}
						to={item.to}
						key={index}
						className="flex items-center pl-16 py-2 gap-1 hover:bg-blue-300 duration-300 ease-in-out "
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
					>
						{item.icon}
						{item.label}
					</NavLink>
				))}
			</div>
		</div>
	)
}

export default DropdownButton
