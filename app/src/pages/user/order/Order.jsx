import { useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { viewUserOrderItems } from "../../../core/services/api"
import LoadingComponent from "../../../components/common/LoadingComponent"
import ErrorFetching from "../../../components/common/ErrorFetching"
import { numberFormat } from "../../../core/utils/priceUtils"
import { Link } from "react-router-dom"

function Order() {
	const [openOrderId, setOpenOrderId] = useState(null)

	const { data, isLoading, isError } = useQuery({
		queryFn: viewUserOrderItems,
		queryKey: ["viewUserOrderItems"],
	})

	const toggleOrderItems = (orderId) => {
		setOpenOrderId(openOrderId === orderId ? null : orderId)
	}

	useEffect(() => {
		document.title = "Order"
	}, [])

	if (isLoading) {
		return <LoadingComponent />
	}
	if (isError) {
		return <ErrorFetching />
	}

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center">
				<h4>Your Shopping Order Is Empty.</h4>
			</div>
		)
	}

	return (
		<div className="sm:px-4">
			<div className="mt-4 bg-white shadow-md rounded-lg">
				<div className="bg-gray-100 p-4 rounded-t-lg">
					<h4 className="text-xl font-semibold">Order List</h4>
				</div>
				<div className="p-4 overflow-y-auto">
					{/* Mobile Card View */}
					<div className="block sm:hidden space-y-4 ">
						{data.map((order) => (
							<div
								key={order.id}
								className="space-y-2 border border-gray-200 rounded-lg p-4 bg-white shadow"
							>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Tracking No:</span>
									<span>{order.tracking_no}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Payment Mode:</span>
									<span>{order.payment_mode}</span>
								</div>
								<div className="flex justify-between items-center ">
									<span className="font-semibold">Shipping Address:</span>
									<span className="text-end pl-12 break-all">
										{order.address}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Status:</span>
									<div
										className={`px-4 py-1 rounded-md text-center ${
											order.status === 0
												? "bg-yellow-300"
												: order.status === 1
												? "bg-blue-300"
												: "bg-green-300"
										}`}
									>
										{order.status === 0
											? "To Ship"
											: order.status === 1
											? "Shipped"
											: "Received"}
									</div>
								</div>
								<div className="flex">
									<button
										className="bg-blue-500 text-white py-1.5 px-3 rounded mt-2 w-full"
										onClick={() => toggleOrderItems(order.id)}
									>
										{openOrderId === order.id ? "Hide" : "View"}
									</button>
								</div>

								{/* Hidden order items */}
								{openOrderId === order.id && (
									<div className="mt-4 bg-white shadow-md rounded-lg">
										<h5 className="font-semibold p-2 bg-gray-100">
											Order Items
										</h5>
										<div>
											{order.order_items.map((orderItem) => {
												const images =
													orderItem.product?.images &&
													orderItem.product.images !== null
														? JSON.parse(orderItem.product.images)[0]
														: null

												return (
													<div
														key={orderItem.id}
														className="p-4 border-b border-gray-200"
													>
														<div className="flex justify-between items-center">
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
															<div className="flex flex-col items-center gap-2">
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
																			: orderItem.product.brand
																	}
																/>
																{orderItem.product ? (
																	order.status === 2 &&
																	(orderItem.isReviewed ? (
																		<span className="text-center  text-sm px-2 bg-gray-500 text-white rounded">
																			Reviewed
																		</span>
																	) : (
																		<Link
																			to={`/product/review/${orderItem.product.slug}`}
																			state={{
																				productId: orderItem.product.id,
																				productName: orderItem.product.name,
																				orderId: order.id,
																			}}
																			className="text-center text-sm px-2 bg-green-500 text-white rounded"
																		>
																			Review
																		</Link>
																	))
																) : (
																	<span className="text-center text-sm px- bg-red-500 text-white rounded">
																		Product Unavailable
																	</span>
																)}
															</div>
														</div>
													</div>
												)
											})}
											{/* Grand Total */}
											<div className="p-4 ">
												<div className="flex items-center gap-2 font-semibold">
													<span>Grand Total: </span>
													<span>
														₱
														{numberFormat(
															order.order_items.reduce(
																(total, orderItem) =>
																	total + orderItem.quantity * orderItem.price,
																0
															)
														)}
													</span>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Desktop Table View */}
					<div className="overflow-x-auto hidden sm:block">
						<table className="w-full border-collapse border border-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="border border-gray-200 p-1 sm:p-2">
										Tracking No.
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Payment Mode
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Shipping Address
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">Status</th>
									<th className="border border-gray-200 p-1 sm:p-2">Details</th>
								</tr>
							</thead>
							<tbody>
								{data.map((order) => (
									<React.Fragment key={order.id}>
										<tr className="border-b border-gray-200 hover:bg-gray-100 text-sm md:text-base">
											<td className="p-2 border-r border-gray-200 break-all">
												{order.tracking_no}
											</td>
											<td className="p-2 border-r border-gray-200 break-all">
												{order.payment_mode}
											</td>
											<td className="p-2 border-r border-gray-200 break-all">
												{order.address}
											</td>
											<td className="p-2 border-r border-gray-200 break-all ">
												<div
													className={`p-1 rounded-md text-center line-clamp-1 ${
														order.status === 0
															? "bg-yellow-300"
															: order.status === 1
															? "bg-blue-300"
															: "bg-green-300"
													}`}
												>
													{order.status === 0
														? "To Ship"
														: order.status === 1
														? "Shipped"
														: "Received"}
												</div>
											</td>
											<td className="p-2 border-r border-gray-200 break-all">
												<div className="text-center">
													<button
														className="bg-blue-500 text-white p-1 rounded"
														onClick={() => toggleOrderItems(order.id)}
													>
														{openOrderId === order.id ? "Hide" : "View"}
													</button>
												</div>
											</td>
										</tr>

										{/* Hidden order items row */}
										{openOrderId === order.id && (
											<tr className="bg-gray-50">
												<td colSpan="5">
													<div className="p-2">
														<h5 className="font-semibold mb-2">Order Items</h5>
														<table className="w-full border-collapse border border-gray-200">
															<thead>
																<tr className="bg-gray-100">
																	<th className="border border-gray-200 p-2">
																		Image
																	</th>
																	<th className="border border-gray-200 p-2">
																		Product Name
																	</th>
																	<th className="border border-gray-200 p-2">
																		Price
																	</th>
																	<th className="border border-gray-200 p-2">
																		Quantity
																	</th>
																	<th className="border border-gray-200 p-2">
																		Total Price
																	</th>
																</tr>
															</thead>

															<tbody>
																{order.order_items.map((orderItem) => {
																	const images =
																		orderItem.product?.images &&
																		orderItem.product.images !== null
																			? JSON.parse(orderItem.product.images)[0]
																			: null
																	return (
																		<tr
																			key={orderItem.id}
																			className="border-collapse border hover:bg-gray-100 text-sm md:text-base"
																		>
																			<td className="py-2 border-r border-gray-200">
																				<div className="flex flex-col items-center text-center ">
																					<img
																						className="w-12"
																						src={
																							images === null
																								? "https://via.placeholder.com/150"
																								: `http://127.0.0.1:8000/${images}`
																						}
																						alt={
																							images === null
																								? "Unavailable"
																								: orderItem.product?.brand ||
																								  "Unavailable"
																						}
																						loading="lazy"
																					/>
																					{orderItem.product ? (
																						order.status === 2 &&
																						(orderItem.isReviewed ? (
																							<span className="px-4 mt-2 bg-gray-500 text-white rounded">
																								Reviewed
																							</span>
																						) : (
																							<Link
																								to={`/product/review/${orderItem.product.slug}`}
																								state={{
																									productId:
																										orderItem.product.id,
																									productName:
																										orderItem.product.name,
																									orderId: order.id,
																								}}
																								className="mx-2 px-2 mt-2 bg-green-500 text-white rounded"
																							>
																								Review
																							</Link>
																						))
																					) : (
																						<span className="px-4 mt-2 bg-red-500 text-white rounded">
																							Product Unavailable
																						</span>
																					)}
																				</div>
																			</td>
																			<td className="px-4 py-2 text-center border-r border-gray-200 break-all">
																				{orderItem.product?.name ||
																					"Unavailable"}
																			</td>
																			<td className="px-4 py-2 text-center border-r border-gray-200">
																				{numberFormat(orderItem.price)}
																			</td>
																			<td className="px-4 py-2 text-center border-r border-gray-200">
																				{orderItem.quantity}
																			</td>
																			<td className="px-4 py-2 text-center">
																				{numberFormat(
																					orderItem.quantity * orderItem.price
																				)}
																			</td>
																		</tr>
																	)
																})}
																<tr className="font-bold">
																	<td
																		colSpan="4"
																		className="px-4 py-2 text-right border-t border-gray-200"
																	>
																		Total Grand Price:
																	</td>
																	<td className="px-4 py-2 text-center border-t border-gray-200">
																		₱
																		{numberFormat(
																			order.order_items.reduce(
																				(total, orderItem) =>
																					total +
																					orderItem.quantity * orderItem.price,
																				0
																			)
																		)}
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</td>
											</tr>
										)}
									</React.Fragment>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Order
