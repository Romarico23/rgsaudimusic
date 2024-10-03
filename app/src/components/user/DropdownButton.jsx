import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md"

function DropdownButton({ items, icon }) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null) // Create a reference for the dropdown

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	// Close the dropdown if clicking outside of it
	useEffect(() => {
		function handleClickOutside(event) {
			// Check if the click is outside the dropdown
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		// Add the event listener to detect outside clicks
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			// Clean up the event listener on component unmount
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [dropdownRef])

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Button that triggers dropdown */}
			<button
				className="w-full flex items-center ease-in-out duration-300"
				onClick={toggleDropdown}
			>
				{icon}
				<span
					className={`transform transition-transform ease-in-out duration-300 ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
				>
					{isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowRight />}
				</span>
			</button>

			{/* Dropdown content with slide effect */}
			<div
				className={`${
					isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
				} transition-all duration-300 ease-in-out transform ${
					isOpen ? "translate-y-0" : "-translate-y-2"
				} overflow-hidden absolute right-0 mt-2 bg-gray-300 shadow-lg z-10 text-sm rounded-md`}
			>
				{items.map((item, index) => (
					<Link
						onClick={(e) => {
							if (item.label === "Logout") {
								e.preventDefault()
								setIsOpen(true)
							} else {
								setIsOpen(false)
							}
							item.onClick()
						}}
						to={item.to}
						key={index}
						className="flex items-center pr-24 pl-6 py-4 gap-1 rounded-md hover:bg-blue-300 duration-300 ease-in-out"
					>
						{item.icon}
						{item.label}
					</Link>
				))}
			</div>
		</div>
	)
}

export default DropdownButton
