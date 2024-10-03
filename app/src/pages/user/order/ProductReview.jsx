import React, { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
import { addReview } from "../../../core/services/api"
import Swal from "sweetalert2"

function ProductReview() {
	const location = useLocation()
	const { productId, productName, orderId } = location.state
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const [rating, setRating] = useState(0)

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm()

	// Mutation for adding a review
	const mutation = useMutation({
		mutationFn: addReview,
		onSuccess: (data) => {
			Swal.fire("Success", data.message, "success")
			queryClient.invalidateQueries(["viewAllProducts"])
			navigate("/order")
			reset()
			setRating(0)
		},
		onError: (error) => {
			if (error.response.status === 403) {
				Swal.fire("Error", error.response.data.message, "error")
			}
			Object.keys(error.response.data.errors).forEach((field) => {
				setError(field, {
					type: "manual",
					message: error.response.data.errors[field].join(" "),
				})
			})
		},
	})

	// Submit handler
	const onSubmit = (data) => {
		mutation.mutate({
			...data,
			product_id: productId,
			rating,
			order_id: orderId,
		})
	}

	useEffect(() => {
		document.title = "Product Review"
	}, [])

	return (
		<div className="p-4 max-w-md mx-auto">
			<h4 className="text-xl font-semibold mb-4">
				Leave a Review for {productName}
			</h4>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
				<div className="mb-4">
					<label className="block mb-2">Rating</label>
					<div className="flex items-center">
						{[1, 2, 3, 4, 5].map((star) => (
							<label key={star} className="cursor-pointer">
								<input
									type="radio"
									value={star}
									{...register("rating")}
									onChange={() => setRating(star)}
									className="hidden"
								/>
								<svg
									className={`h-6 w-6 ${
										star <= rating ? "text-yellow-400" : "text-gray-300"
									}`}
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M10 15l-5.878 3.09 1.119-6.512L0 6.382l6.618-.963L10 0l2.382 5.419L20 6.382l-5.241 5.096 1.119 6.512z" />
								</svg>
							</label>
						))}
					</div>
					{errors.rating && (
						<span className="text-red-500">{errors.rating.message}</span>
					)}
				</div>
				<div className="mb-4">
					<label className="block mb-2">Comment</label>
					<textarea
						{...register("review")}
						className="w-full border rounded p-2"
						rows="3"
						placeholder="Write your review here..."
					></textarea>
					{errors.review && (
						<span className="text-red-500">{errors.review.message}</span>
					)}
				</div>
				<button
					type="submit"
					disabled={mutation.isPending}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					{mutation.isPending ? "Submitting Review" : "Submit Review"}
				</button>
			</form>
		</div>
	)
}

export default ProductReview
