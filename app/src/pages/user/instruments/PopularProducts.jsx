import React, { useState } from "react"
import { viewAllProducts } from "../../../core/services/api"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import LoadingComponent from "../../../components/common/LoadingComponent"
import ErrorFetching from "../../../components/common/ErrorFetching"
import { numberFormat } from "../../../core/utils/priceUtils"
import { FaCartPlus, FaStar } from "react-icons/fa"
import { useAddToCart } from "../../../core/hooks/useAddToCart"

function PopularProducts() {
	const [quantity, setQuantity] = useState(1)

	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryFn: viewAllProducts,
		queryKey: ["viewAllProducts"],
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const mutation = useAddToCart()

	const getAverageRating = (product) => {
		const reviews = product.reviews
		if (!reviews || reviews.length === 0) return { average: 0, count: 0 }
		const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
		const average = totalRating / reviews.length
		return { average, count: reviews.length }
	}

	const submitAddToCart = (e, product_id) => {
		const cartData = {
			product_id: product_id,
			product_quantity: quantity,
		}
		mutation.mutate(cartData)
	}

	if (isLoading) {
		return <LoadingComponent />
	}

	if (isError) {
		return <ErrorFetching />
	}

	return (
		<div className="p-4">
			<h1 className="text-xl lg:text-2xl font-semibold text-orange-500 mb-4 text-center md:text-left">
				POPULAR PRODUCTS
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((item) => {
					const { average, count } = getAverageRating(item)

					return (
						item.popular === 1 && (
							<div
								key={item.id}
								className="relative px-2 flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
							>
								<Link
									className="relative mx-auto mt-3 flex h-48 sm:h-60 overflow-hidden rounded-xl"
									to={`/instruments/${item.category.slug}/${item.slug}`}
								>
									<img
										className="h-full w-full object-cover"
										src={`http://127.0.0.1:8000/${JSON.parse(item.images)[0]}`}
										alt={item.name}
										loading="lazy"
									/>
								</Link>
								<div className="p-2">
									<Link to={`/instruments/${item.category.slug}/${item.slug}`}>
										<h3 className="font-semibold text-slate-900 truncate">
											{item.name}
										</h3>
									</Link>
									<div className="mt-2 mb-2 flex flex-col items-start">
										<span className="font-bold text-slate-900">
											₱ {numberFormat(item.selling_price)}
										</span>
										<span className="text-sm text-slate-900 line-through">
											₱ {numberFormat(item.original_price)}
										</span>
									</div>

									{/* Star Ratings */}
									<div className="flex text-sm items-center mb-2">
										{[...Array(5)].map((_, index) => (
											<FaStar
												key={index}
												className={`${
													index < Math.round(average)
														? "text-yellow-500"
														: "text-gray-300"
												}`}
											/>
										))}
										<span className="ml-2 text-xs text-gray-500">
											({count} {count === 1 ? "rating" : "ratings"})
										</span>
									</div>

									{/* Add to Cart Button */}
									<button
										className="mt-4 flex gap-2 items-center justify-center rounded-md bg-slate-900 w-full py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors duration-300"
										disabled={mutation.isPending || item.quantity === "0"}
										onClick={(e) => submitAddToCart(e, item.id)}
									>
										<FaCartPlus /> Add to Cart
									</button>
								</div>
							</div>
						)
					)
				})}
			</div>
		</div>
	)
}

export default PopularProducts
