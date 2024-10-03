import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { productsSearch } from "../../core/services/api"
import { numberFormat } from "../../core/utils/priceUtils"

function SearchResults() {
	const location = useLocation()
	const queryParams = new URLSearchParams(location.search)
	const searchQuery = queryParams.get("query")

	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryFn: () => productsSearch(searchQuery),
		queryKey: ["products", searchQuery],
		enabled: !!searchQuery, // Only run if query exists
	})

	useEffect(() => {
		document.title = "Search"
	}, [])

	return (
		<div className="p-4">
			<h1 className="text-2xl mb-4">Search Results for "{searchQuery}"</h1>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error fetching search results.</p>}
			{products && products.length > 0 ? (
				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{products.map((item) => {
						return (
							<div
								key={item.id}
								className="relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
							>
								<Link
									className="relative mx-auto mt-3 flex h-60 overflow-hidden rounded-xl"
									to={`/instruments/${item.category.slug}/${item.slug}`}
								>
									<img
										className="h-full w-full object-cover"
										src={`http://127.0.0.1:8000/${JSON.parse(item.images)[0]}`}
										alt={item.name}
										loading="lazy"
									/>
								</Link>
								<div className="mt-4 px-5 pb-5">
									<Link to={`/instruments/${item.category.slug}/${item.slug}`}>
										<h3 className="text-xl tracking-tight text-slate-900">
											{item.name}
										</h3>
									</Link>
									<div className="mt-2 mb-5 flex items-center justify-between">
										<p>
											<span className="text-2xl font-bold text-slate-900">
												₱ {numberFormat(item.selling_price)}
											</span>
											<br />
											<span className="text-sm text-slate-900 line-through">
												₱ {numberFormat(item.original_price)}
											</span>
										</p>
									</div>
								</div>
							</div>
						)
					})}
				</ul>
			) : (
				<p>No products found.</p>
			)}
		</div>
	)
}

export default SearchResults
