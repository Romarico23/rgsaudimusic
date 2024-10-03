import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../../../core/hooks/useLogoutMutation"
import {
	IoIosLogOut,
	IoMdAddCircleOutline,
	IoMdCart,
	IoMdSearch,
	IoMdMenu,
	IoMdClose,
} from "react-icons/io"
import {
	productsSearch,
	viewCart,
	viewUserOrderItems,
} from "../../../core/services/api"
import { userProfile } from "../../../core/services/auth"
import { LiaClipboardListSolid } from "react-icons/lia"
import DropdownButton from "../DropdownButton"
import { FaPhone, FaUserEdit } from "react-icons/fa"
import { numberFormat } from "../../../core/utils/priceUtils"
import user_placeholder from "/src/assets/user_placeholder.png"
import { AiOutlineLogin } from "react-icons/ai"

function Navbar() {
	const [query, setQuery] = useState("")
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const dropdownRef = useRef(null)

	const {
		data: cart,
		isLoading: cartIsLoading,
		isError: cartIsError,
	} = useQuery({
		queryFn: viewCart,
		queryKey: ["cart"],
		staleTime: Infinity,
		cacheTime: Infinity,
	})

	const {
		data: order,
		isLoading: orderIsLoading,
		isError: orderIsError,
	} = useQuery({
		queryFn: viewUserOrderItems,
		queryKey: ["viewUserOrderItems"],
		staleTime: Infinity,
		cacheTime: Infinity,
	})

	const {
		data: user,
		isLoading: userIsLoading,
		isError: userIsError,
	} = useQuery({
		queryFn: userProfile,
		queryKey: ["userProfile"],
		staleTime: Infinity,
		cacheTime: Infinity,
	})

	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryFn: () => productsSearch(query),
		queryKey: ["products", query],
		enabled: query.length > 0,
	})

	const handleChange = (event) => {
		setQuery(event.target.value)
		setIsDropdownOpen(true)
	}

	const mutation = useLogoutMutation()

	const handleLogout = async () => {
		mutation.mutate()
	}

	const handleSearchClick = () => {
		if (query) {
			navigate(`/searchresults?query=${query}`)
		}
		setIsMobileMenuOpen(false)
	}

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	// Close the dropdown if clicking outside of it
	useEffect(() => {
		function handleClickOutside(event) {
			// Check if the click is outside the dropdown
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsMobileMenuOpen(false)
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
		<nav
			className={`${
				isMobileMenuOpen && "p-10"
			} p-4 md:p-4 border-b border-gray-100 shadow-md`}
			ref={dropdownRef}
		>
			<div
				className={`flex flex-col pt-2 gap-4 ${
					isMobileMenuOpen ? "items-center" : "items-start pt-0"
				} 
					md:pt-0 md:flex-row md:justify-between md:items-center
				`}
			>
				{/* Logo */}
				<div className={`${!isMobileMenuOpen ? "pl-3" : "hidden"} md:block`}>
					<Link to="/">
						<img
							src="/rgs-logo.png"
							alt="Logo"
							className="rounded-full w-14 h-14 object-cover hover:opacity-50 ease-in-out duration-300"
						/>
					</Link>
				</div>

				{/* Hamburger Icon */}
				<button
					className={`${
						isMobileMenuOpen ? "" : ""
					} top-8 right-6 text-2xl absolute md:hidden z-20`}
					onClick={toggleMobileMenu}
				>
					{isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
				</button>

				{/* Navigation Links */}
				<div
					className={`${
						isMobileMenuOpen
							? "max-h-full opacity-100 pointer-events-auto"
							: "max-h-0 opacity-0 pointer-events-none md:pointer-events-auto"
					} transition-all duration-300 ease-in-out transform ${
						isMobileMenuOpen ? "translate-y-0" : "-translate-y-2"
					} flex flex-col items-center gap-4 py-6 absolute w-full pt- top-0 right-0 bg-white shadow-lg z-10 text-sm rounded-md
						md:max-h-[0px] md:opacity-100 md:translate-y-0 md:overflow-visible md:static md:mt-0
						md:mt-0 md:bg-transparent md:shadow-none md:rounded-none md:translate-y-0 md:flex md:flex-row
						md:justify-end md:space-x-6 md:gap-0 lg:gap-4`}
				>
					<div
						className={`relative pl-3 xl:mr-40 md:block ${
							isMobileMenuOpen ? "" : "hidden"
						} `}
					>
						<input
							type="text"
							placeholder="Search for products..."
							className="sm:text-base sm:pr-10 xl:pr-40 pl-3 py-2 border-2 rounded-md border-gray-400 focus:outline-blue-400"
							value={query}
							onChange={handleChange}
							onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
							onFocus={() => setIsDropdownOpen(true)}
						/>
						{isDropdownOpen && location.pathname !== "/searchresults" && (
							<div className="absolute top-full left-3 mr-3 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
								{isLoading && <p>Loading...</p>}
								{isError && <p>Error fetching data.</p>}
								{products && products.length > 0 ? (
									<ul className="max-h-60 overflow-y-auto">
										{products.map((product) => (
											<li
												key={product.id}
												className="p-2 border-b border-gray-200 hover:bg-gray-100"
											>
												<Link
													to={`/instruments/${product.category.slug}/${product.slug}`}
													className=""
													onMouseDown={(e) => e.preventDefault()}
												>
													<h2 className="font-bold">{product.name}</h2>
													<p>Brand: {product.brand}</p>
													<p>Price: ₱{numberFormat(product.selling_price)}</p>
												</Link>
											</li>
										))}
									</ul>
								) : (
									<p className="p-2">No products found.</p>
								)}
							</div>
						)}
						<button
							className="text-2xl absolute top-2.5 right-2 rounded-md hover:text-blue-500 ease-in-out duration-300"
							onClick={handleSearchClick}
						>
							<IoMdSearch />
						</button>
					</div>

					<NavLink
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						className="hover:text-blue-300 ease-in-out duration-300"
						to="/"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						Home
					</NavLink>
					<NavLink
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						className="hover:text-blue-300 ease-in-out duration-300"
						to="instruments"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						Instruments
					</NavLink>
					<NavLink
						className="relative group"
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						to="cart"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<IoMdCart className="text-2xl group-hover:text-blue-300 ease-in-out duration-300" />
						{!cart || cartIsError
							? ""
							: !cartIsLoading &&
							  cart.length > 0 && (
									<span className="group-hover:text-gray-800 group-hover:bg-red-300 ease-in-out duration-300 absolute flex items-center justify-center left-[1rem] bottom-[1rem] h-5 w-5 bg-red-500 text-white rounded-full text-xs font-semibold">
										{cart.length}
									</span>
							  )}
					</NavLink>
					<NavLink
						className="relative group"
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						to="order"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<LiaClipboardListSolid className="text-2xl group-hover:text-blue-300 ease-in-out duration-300" />
						{!order || orderIsError
							? ""
							: !orderIsLoading &&
							  order.length > 0 && (
									<span className="group-hover:text-gray-800 group-hover:bg-red-300 ease-in-out duration-300 absolute flex items-center justify-center left-[1rem] bottom-[1rem] h-5 w-5 bg-red-500 text-white rounded-full text-xs font-semibold">
										{order.length}
									</span>
							  )}
					</NavLink>
					<NavLink
						style={({ isActive }) => ({ color: isActive ? "#3b82f6" : "" })}
						className="hover:text-blue-300 ease-in-out duration-300"
						to="contact"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<FaPhone className="text-2xl" />
					</NavLink>

					{/* Dropdown Button */}
					<DropdownButton
						icon={
							<div className="hover:opacity-50 ease-in-out duration-300">
								<img
									src={`${
										!user || userIsError || userIsLoading
											? user_placeholder
											: `http://127.0.0.1:8000/${user[0].image}`
									} `}
									alt={`${
										!user || userIsError || userIsLoading
											? "User"
											: `${user[0].name}'s profile`
									}`}
									className="rounded-full w-12 h-12 object-cover shadow-md"
								/>
							</div>
						}
						items={
							userIsLoading
								? [
										{
											label: "Loading...",
											icon: <IoMdAddCircleOutline />,
											onClick: () => {},
										},
								  ]
								: [
										{
											to: userIsError ? "login" : "profile",
											label: userIsError ? "Login" : "Profile",
											icon: userIsError ? (
												<AiOutlineLogin />
											) : (
												<IoMdAddCircleOutline />
											),
											onClick: () => setIsMobileMenuOpen(false),
										},
										{
											to: userIsError
												? "register"
												: mutation.isSuccess && "login",
											label: userIsError
												? "Register"
												: mutation.isPending
												? "Logout..."
												: "Logout",
											icon: userIsError ? <FaUserEdit /> : <IoIosLogOut />,
											onClick: userIsError
												? () => setIsMobileMenuOpen(false)
												: !mutation.isPending && handleLogout,
										},
								  ]
						}
					/>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
