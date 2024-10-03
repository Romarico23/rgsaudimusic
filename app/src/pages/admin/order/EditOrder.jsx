import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import {
	editOrder,
	updateOrder,
	viewOrderItems,
} from "../../../core/services/api"
import LoadingComponent from "../../../components/common/LoadingComponent"
import ErrorFetching from "../../../components/common/ErrorFetching"
import { formatDate } from "../../../core/utils/dateUtils"
import Swal from "sweetalert2"
import { useForm } from "react-hook-form"
import { numberFormat } from "../../../core/utils/priceUtils"

function EditOrder() {
	const { id } = useParams()
	const queryClient = useQueryClient()

	// Fetch the order data
	const {
		data: order,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["editOrder", id],
		queryFn: () => editOrder(id),
	})

	const {
		data: orderItems,
		isLoading: orderItemsIsLoading,
		isError: orderItemsIsError,
	} = useQuery({
		queryFn: viewOrderItems,
		queryKey: ["viewOrderItems"],
	})

	// Initialize react-hook-form with default values
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { isSubmitting },
	} = useForm()

	// Watch status value to sync with increment/decrement buttons
	const watchStatus = watch("status") || 0

	// Increment and Decrement handlers
	const increment = () => {
		const newStatus = Math.min(Number(watchStatus) + 1, 2)
		setValue("status", newStatus)
	}

	const decrement = () => {
		const newStatus = Math.max(Number(watchStatus) - 1, 0)
		setValue("status", newStatus)
	}

	const mutation = useMutation({
		mutationFn: updateOrder,
		onSuccess: (data) => {
			queryClient.invalidateQueries(["editOrder", id])
			queryClient.invalidateQueries(["viewOrderItems"])
			Swal.fire("Success", "Order Updated Successfully", "success")
		},
		onError: (error) => {
			Swal.fire("Error", "Complete the details", "error")
		},
	})

	// Handle form submission
	const onSubmit = (data) => {
		mutation.mutate({ id, data })
	}

	// Filter orderItems based on the id
	const filteredOrderItems = orderItems
		? orderItems.filter((item) => item.id === Number(id))
		: []

	useEffect(() => {
		document.title = "Edit Order"
	}, [])

	if (isLoading || orderItemsIsLoading) {
		return <LoadingComponent />
	}

	if (isError || orderItemsIsError) {
		return <ErrorFetching />
	}

	return (
		<div>
			<div className="container mx-auto p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Order & Account Information */}
					<div className="bg-white shadow-md p-6 rounded-lg">
						<h2 className="font-semibold text-xl mb-">Order Information:</h2>

						{/* Order Details */}
						<div className="mb-6">
							<h3 className="font-bold">Order #{order.id}</h3>

							{/* Display product name and image */}
							<div className="my-4">
								<h4 className="font-semibold">Ordered Products:</h4>

								{filteredOrderItems.map((item) => (
									<div key={item.id} className="pl-2">
										{item.order_items.map((orderItem) => {
											const images =
												orderItem.product?.images &&
												orderItem.product.images !== null
													? JSON.parse(orderItem.product.images)[0]
													: null

											return (
												<div
													key={orderItem.id}
													className="flex items-center border-b border-gray-200"
												>
													<div className="w-full pr-4 text-left text-sm">
														<p>
															<strong>
																{orderItem.product?.name || "Unavailable"}
															</strong>
														</p>
														<p>
															<strong>Price: </strong>₱
															{numberFormat(orderItem.price)}
														</p>
														<p>
															<strong>Quantity: </strong>
															{orderItem.quantity}
														</p>
														<p>
															<strong>Total: </strong>₱
															{numberFormat(
																orderItem.quantity * orderItem.price
															)}
														</p>
													</div>
													<div className="flex flex-col items-center gap-2 pb-2">
														<img
															className="h-16 w-16"
															src={
																images === null
																	? "https://via.placeholder.com/150"
																	: `http://127.0.0.1:8000/${images}`
															}
															alt={
																images === null
																	? "Unavailable"
																	: orderItem.product?.brand
															}
														/>
														{!orderItem.product && (
															<span className="text-center text-sm bg-red-500 text-white rounded">
																Product Unavailable
															</span>
														)}
													</div>
												</div>
											)
										})}
									</div>
								))}

								{/* Compute and Display the Grand Total */}
								<div className="mt-1 pl-">
									<h4 className="font-semibold">Grand Total:</h4>
									<p className="text- font-bold">
										₱
										{numberFormat(
											filteredOrderItems.reduce((grandTotal, item) => {
												// Calculate total for each order's items
												return (
													grandTotal +
													item.order_items.reduce(
														(total, orderItem) =>
															total + orderItem.quantity * orderItem.price,
														0
													)
												)
											}, 0)
										)}
									</p>
								</div>
							</div>

							<div className="my-2">
								<p className="font-semibold">Order Date</p>
								<p>{formatDate(order.created_at)}</p>
							</div>
							<div className="mt-2">
								<p className="font-semibold">Payment Mode</p>
								<p>{order.payment_mode}</p>
							</div>
							<div className="mt-2">
								<p className="font-semibold">Payment Id</p>
								<p>{order?.payment_id || "cod"}</p>
							</div>
							<div className="mt-2">
								<p className="font-semibold">Tracking No</p>
								<p>{order.tracking_no}</p>
							</div>

							{/* Form to edit order status and remark */}
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mt-2">
									<p className="font-semibold">
										Order Status (0-toship/1-shipped/2-delivered)
									</p>
									<div className="flex items-center justify-center border rounded w-28">
										<button
											type="button"
											className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-l"
											onClick={decrement}
										>
											-
										</button>
										<input
											type="text"
											className="w-12 py-1 text-center outline-none border-1"
											defaultValue={order.status}
											{...register("status")}
											readOnly
										/>
										<button
											type="button"
											className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-r"
											onClick={increment}
										>
											+
										</button>
									</div>
								</div>
								<div className="mt-2">
									<p className="font-semibold">Remark</p>
									<input
										type="text"
										className="border p-2 rounded w-full"
										{...register("remark")}
									/>
								</div>
								<div className="mt-4">
									<button
										type="submit"
										className="bg-blue-500 text-white py-2 px-4 rounded"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Submitting..." : "Submit"}
									</button>
								</div>
							</form>
						</div>
					</div>

					<div className="bg-white shadow-md p-6 rounded-lg">
						{/* Account Information */}
						<div className="space-y-2">
							<h3 className="text-xl font-bold">Account Information:</h3>
							<div className="mt-">
								<p className="font-semibold">Customer Name</p>
								<p>{order.firstname + " " + order.lastname}</p>
							</div>
							<div className="mt-2">
								<p className="font-semibold">Email</p>
								<p>{order.email}</p>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-2">
							<h2 className="font-semibold text-xl mt-4">
								Address Information:
							</h2>
							<div>
								<div>
									<h3 className="font-bold">Address</h3>
									<p className="break-all">{order.address}</p>
									<p>
										{order.city}, {order.state}, {order.zipcode}
									</p>
								</div>
								<div>
									<h3 className="font-bold">Contact Number</h3>
									<p>{order.phone}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditOrder
