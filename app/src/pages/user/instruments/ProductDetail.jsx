import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import LoadingComponent from "../../../components/common/LoadingComponent"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { viewProductDetail } from "../../../core/services/api"
import Swal from "sweetalert2"
import { numberFormat } from "../../../core/utils/priceUtils"
import { useAddToCart } from "../../../core/hooks/useAddToCart"
import { FaStar } from "react-icons/fa"

function ProductDetail() {
	const { category_slug, product_slug } = useParams()
	const [quantity, setQuantity] = useState(1)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [showReviews, setShowReviews] = useState(false)

	const {
		data: productDetail,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["productDetail", category_slug, product_slug],
		queryFn: () => viewProductDetail(category_slug, product_slug),
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const mutation = useAddToCart()

	const handleCartDecrement = () => {
		quantity > 1
			? setQuantity((prevCount) => prevCount - 1)
			: Swal.fire("Warning", "Quantity cannot be less than 1", "warning")
	}

	const handleCartIncrement = () => {
		productDetail.quantity !== quantity
			? setQuantity((prevCount) => prevCount + 1)
			: Swal.fire("Warning", `You've reached the maximum quantity`, "warning")
	}

	const handleNextImage = (images) => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		)
	}

	const handlePrevImage = (images) => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		)
	}

	const submitAddToCart = () => {
		const cartData = {
			product_id: productDetail.id,
			product_quantity: quantity,
		}
		mutation.mutate(cartData)
	}

	if (isLoading) {
		return <LoadingComponent />
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center">
				<h4>Error: {error.message}</h4>
			</div>
		)
	}

	const images = JSON.parse(productDetail.images)

	const avail_stock =
		productDetail.quantity > 0 ? (
			<div>
				<label className="bg-green-500 text-white text-sm px-4 py-2 mt-2 rounded">
					In stock
				</label>
				<div className="flex items-center gap-4 mt-3">
					<div className="flex items-center border rounded">
						<button
							type="button"
							onClick={handleCartDecrement}
							className="bg-gray-200 px-3 py-2 rounded"
						>
							-
						</button>
						<div className="mx-2 text-center w-8">{quantity}</div>
						<button
							type="button"
							onClick={handleCartIncrement}
							className="bg-gray-200 px-3 py-2 rounded"
						>
							+
						</button>
					</div>
					<button
						type="button"
						onClick={submitAddToCart}
						className="bg-blue-600 text-white px-4 py-2 rounded"
					>
						Add to Cart
					</button>
				</div>
			</div>
		) : (
			<div>
				<label className="bg-red-500 text-white text-sm px-4 py-2 mt-2 rounded">
					Out of stock
				</label>
			</div>
		)

	// Function to toggle reviews
	const toggleReviews = () => {
		setShowReviews((prev) => !prev)
	}

	return (
		<div>
			<div className="px-4 py-6 md:py-0 lg:py-6">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-20 md:items-center lg:items-start">
						<div className="relative overflow-hidden max-w-screen-md mx-auto">
							<img
								src={`http://127.0.0.1:8000/${images[currentImageIndex]}`}
								alt={productDetail.name}
								className="w-full rounded-lg md:py-20 lg:py-0 md:h-full lg:h-auto"
								loading="lazy"
							/>
							<div className="absolute inset-0 flex items-center justify-between">
								<IoIosArrowBack
									className="rounded-full opacity-75 hover:opacity-100 hover:cursor-pointer"
									onClick={() => handlePrevImage(images)}
									size={40}
								/>
								<IoIosArrowForward
									onClick={() => handleNextImage(images)}
									className="rounded-full opacity-75 hover:opacity-100 hover:cursor-pointer"
									size={40}
								/>
							</div>
						</div>

						<div>
							<h4 className="text-2xl font-semibold">
								{productDetail.name}
								<span className="float-right bg-red-500 text-white text-xs px-3 py-1 rounded-full">
									{productDetail.brand}
								</span>
							</h4>
							<p className="mt-4">{productDetail.description}</p>
							<h4 className="text-xl font-bold mt-4">
								Price: ₱ {numberFormat(productDetail.selling_price)}
								<s className="text-gray-500 ml-2">
									₱ {numberFormat(productDetail.original_price)}
								</s>
							</h4>
							<div className="mt-4">{avail_stock}</div>
						</div>
					</div>

					{/* Reviews Section */}
					<div className="mt-8">
						<button
							onClick={toggleReviews}
							className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
						>
							{showReviews ? "Hide Reviews" : "Show Reviews"}
						</button>

						{showReviews && (
							<div className="space-y-4">
								<h5 className="text-lg font-semibold">Customer Reviews</h5>
								{productDetail.reviews && productDetail.reviews.length > 0 ? (
									productDetail.reviews.map((review) => (
										<div
											key={review.id}
											className="border rounded-lg p-4 shadow-md"
										>
											<div className="flex items-center gap-4">
												<img
													className="rounded-full h-14 w-14 object-cover border border-gray-300"
													src={`http://127.0.0.1:8000/${review.user.image}`}
													alt={review.user.name}
													loading="lazy"
												/>
												<div>
													<strong className="text-lg">
														{review.user.name}
													</strong>
													<p className="text-sm text-gray-600">
														{review.review}
													</p>
												</div>
											</div>
											<p className="flex items-center gap-2 mt-2 text-sm text-yellow-500">
												{[...Array(5)].map((_, index) => (
													<FaStar
														key={index}
														className={`${
															index < Math.round(review.rating)
																? "text-yellow-500"
																: "text-gray-300"
														}`}
													/>
												))}
												<span className="text-gray-400">
													({review.rating} of 5)
												</span>
											</p>
										</div>
									))
								) : (
									<p className="text-gray-500">No reviews available.</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductDetail
