import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom"
import { getCategory } from "../../../core/services/api"
import LoadingComponent from "../../../components/common/LoadingComponent"
import PopularProducts from "./PopularProducts"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import ErrorFetching from "../../../components/common/ErrorFetching"

function ViewCategory() {
	const location = useLocation()
	const { category_slug, product_slug } = useParams()
	const { slug } = useParams()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const { data, isLoading, isError } = useQuery({
		queryFn: getCategory,
		queryKey: ["categoryList"],
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	useEffect(() => {
		document.title = "Instruments"
	}, [])

	if (isLoading) {
		return <LoadingComponent />
	}
	if (isError) {
		return <ErrorFetching />
	}

	return (
		<div className="h-screen flex flex-col">
			<div className="bg-yellow-500 pl-8 py-3">
				<div className="mx-auto">
					<h6>
						Instruments
						{slug ? ` / ${slug}` : category_slug ? ` / ${category_slug}` : ""}
						{product_slug ? ` / ${product_slug}` : ""}
					</h6>
				</div>
			</div>

			{/* Mobile Toggle for Categories */}
			<div className="flex flex-1 relative">
				{product_slug ? (
					""
				) : (
					<div
						className={`flex flex-col justify-center lg:justify-start fixed z-50 top-0 left-0 w-64 min-h-screen lg:static bg-white shadow-gray-300 shadow-lg transform duration-300 ease-in-out
				${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
					>
						<button
							className="absolute top-1/2 left-full transform -translate-y-1/2 -translate-x-1/2 bg-blue-500 p-2 rounded-full text-white lg:hidden"
							onClick={toggleMobileMenu}
						>
							<HiOutlineMenuAlt3 size={30} />
						</button>

						<div className="flex flex-col items-center gap-4">
							<div className="pr-14 lg:pt-10">
								<h1 className="text-xl lg:text-2xl text-orange-500">
									Instruments
								</h1>
							</div>
							<div className="w-full">
								{data.map((item) => (
									<div key={item.id}>
										<NavLink
											className="flex items-center gap-1 hover:bg-blue-300 ease-in-out duration-300"
											style={({ isActive }) => ({
												color: isActive ? "#3b82f6" : "",
											})}
											to={`/instruments/${item.slug}`}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											<h5 className="pl-16 py-2 text-lg lg:text-xl">
												{item.name}
											</h5>
										</NavLink>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{isMobileMenuOpen && (
					<div
						className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
						onClick={toggleMobileMenu}
					/>
				)}

				<div className="flex-1">
					{location.pathname === "/instruments" ? (
						<main>
							<PopularProducts />
						</main>
					) : (
						<main>
							<Outlet />
						</main>
					)}
				</div>
			</div>
		</div>
	)
}

export default ViewCategory
