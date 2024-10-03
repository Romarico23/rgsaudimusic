import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	deleteCartItem,
	updateCartQuantity,
	viewCart,
} from "../../core/services/api"
import LoadingComponent from "../../components/common/LoadingComponent"
import Swal from "sweetalert2"
import ErrorFetching from "../../components/common/ErrorFetching"
import { FaTrash } from "react-icons/fa"
import { numberFormat } from "../../core/utils/priceUtils"

function Cart() {
	const queryClient = useQueryClient()
	const [selectedItems, setSelectedItems] = useState([]) // To track selected items
	const [isAllSelected, setIsAllSelected] = useState(false)

	const { data, isLoading, isError } = useQuery({
		queryFn: viewCart,
		queryKey: ["cart"],
		staleTime: Infinity,
		cacheTime: Infinity,
	})

	const updateCartMutation = useMutation({
		mutationFn: ({ cart_id, scope }) => updateCartQuantity({ cart_id, scope }),
		onMutate: async ({ cart_id, scope }) => {
			await queryClient.cancelQueries(["cart"])

			const previousCart = queryClient.getQueryData(["cart"])

			queryClient.setQueryData(["cart"], (old) => {
				return old.map((item) => {
					if (item.id === cart_id) {
						return {
							...item,
							product_quantity:
								scope === "inc"
									? item.product_quantity + 1
									: item.product_quantity - 1,
						}
					}
					return item
				})
			})

			return { previousCart }
		},
		onError: (err, context) => {
			queryClient.setQueryData(["cart"], context.previousCart)
			Swal.fire("Error", err.response.data.message, "error")
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["cart"])
		},
	})

	const deleteCartItemMutation = useMutation({
		mutationFn: deleteCartItem,
		// Use onMutate to optimistically update the cart
		onMutate: async (cart_id) => {
			await queryClient.cancelQueries(["cart"]) // Cancel any outgoing refetches

			const previousCart = queryClient.getQueryData(["cart"]) // Snapshot previous cart

			// Optimistically update the cart data by removing the item
			queryClient.setQueryData(["cart"], (old) => {
				return old.filter((item) => item.id !== cart_id)
			})

			return { previousCart } // Return context for rollback
		},
		onError: (error, cart_id, context) => {
			// Rollback to the previous cart data on error
			queryClient.setQueryData(["cart"], context.previousCart)
			Swal.fire("Error", error.response.data.message, "error")
		},
		onSuccess: (data) => {
			// Swal.fire("Success", data.message, "success")
		},
	})

	const handleDecrement = (item, cart_id) => {
		item.product_quantity > 1
			? updateCartMutation.mutate({ cart_id, scope: "dec" })
			: Swal.fire("Warning", "Quantity cannot be less than 1", "warning")
	}

	const handleIncrement = (item, cart_id) => {
		item.product_quantity < Number(item.product.quantity)
			? updateCartMutation.mutate({ cart_id, scope: "inc" })
			: Swal.fire("Warning", "You've reached the maximum quantity", "warning")
	}

	const deleteCartItemButton = (e, cart_id) => {
		deleteCartItemMutation.mutate(cart_id)
	}

	const toggleSelectItem = (itemId) => {
		setSelectedItems((prevSelectedItems) => {
			const newSelectedItems = prevSelectedItems.includes(itemId)
				? prevSelectedItems.filter((id) => id !== itemId)
				: [...prevSelectedItems, itemId]

			setIsAllSelected(newSelectedItems.length === data.length)

			return newSelectedItems
		})
	}

	const toggleSelectAll = () => {
		if (isAllSelected) {
			setSelectedItems([])
			setIsAllSelected(false)
		} else {
			setSelectedItems(data.map((item) => item.id))
			setIsAllSelected(true)
		}
	}

	// Preserve selectedItems when cart data is refetched
	// useEffect(() => {
	// 	if (data) {
	// 		setSelectedItems((prevSelectedItems) => {
	// 			// Keep only selected items that still exist in the refetched cart
	// 			return prevSelectedItems.filter((id) =>
	// 				data.some((item) => item.id === id)
	// 			)
	// 		})
	// 	}
	// }, [data])

	useEffect(() => {
		document.title = "Cart"
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
				<h4>Your Shopping Cart Is Empty.</h4>
			</div>
		)
	}

	let totalGrandPrice = data
		.filter((item) => {
			// Ensure that both item.product and selling_price exist
			return item.product && selectedItems.includes(item.id)
		})
		.reduce((total, item) => {
			// Safely extract selling_price, defaulting to 0 if undefined
			const sellingPriceNumber = Number(
				item.product?.selling_price?.replace(/,/g, "") || 0
			)
			const totalCartPrice = item.product_quantity * sellingPriceNumber
			return total + totalCartPrice
		}, 0)

	return (
		<div className="p-2 sm:px-4">
			<div className="mt-4 bg-white shadow-md rounded-lg">
				<div className="bg-gray-100 p-3 sm:p-4 rounded-t-lg">
					<h4 className="text-lg sm:text-xl font-semibold">Cart List</h4>
				</div>
				<div className="p-4 overflow-y-auto">
					{/* For mobile (card view) */}
					<div className="block sm:hidden space-y-4 ">
						<div className="flex justify-end">
							<label htmlFor="selectAll" className="text-gray-700">
								Select All
							</label>
							<input
								className="ml-2 mr-[17px] mt-"
								type="checkbox"
								checked={isAllSelected}
								onChange={toggleSelectAll}
								id="selectAll"
							/>
						</div>

						{data.map((item, index) => {
							const images =
								item.product?.images && item.product.images !== null
									? JSON.parse(item.product.images)[0]
									: null
							return images === null ? (
								<div key={`${item.id}-${index}`} className="text-center py-4">
									<LoadingComponent />
								</div>
							) : (
								<div
									key={`${item.id}-${index}`}
									className="flex justify-between border border-gray-200 rounded-lg p-4 bg-white shadow"
								>
									<div className="w-full text-left pr-4 space-y-2 text-sm">
										<p>
											<strong>{item.product.name}</strong>
										</p>
										<p>
											<strong>Price: </strong>₱
											{numberFormat(item.product.selling_price)}
										</p>
										<p>
											<strong>Quantity: </strong>
											{item.product_quantity}
										</p>
										<p>
											<strong>Total: </strong>₱
											{numberFormat(
												item.product_quantity * item.product.selling_price
											)}
										</p>
										<button
											className="text-red-500 bg-red-200 p-1 rounded"
											onClick={(e) => deleteCartItemButton(e, item.id)}
										>
											<FaTrash size={20} />
										</button>
									</div>
									<div className="flex flex-col justify-between items- py-2">
										<div className="flex gap-2">
											<img
												className="h-20 w-20"
												src={`http://127.0.0.1:8000/${images}`}
												alt={item.product.brand}
											/>
											<input
												type="checkbox"
												checked={selectedItems.includes(item.id)}
												onChange={() => toggleSelectItem(item.id)}
											/>
										</div>
										<div className="flex">
											<button
												className="text-lg bg-gray-200 hover:bg-gray-300 rounded px-2"
												onClick={() => handleDecrement(item, item.id)}
											>
												-
											</button>
											<input
												type="text"
												className="w-10 py-1 text-center outline-none border-1"
												value={item.product_quantity}
												readOnly
											/>
											<button
												className="text-lg bg-gray-200 hover:bg-gray-300 rounded px-2"
												onClick={() => handleIncrement(item, item.id)}
											>
												+
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* For larger screens (table view) */}
				<div className="hidden sm:block">
					<div className="md:p-2 sm:p- overflow-y-auto">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse border border-gray-200">
								<thead>
									<tr className="bg-gray-100">
										<th className="border border-gray-200 p-1 sm:p-2">
											<input
												type="checkbox"
												checked={isAllSelected}
												onChange={toggleSelectAll}
											/>
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Image
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Product
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Price
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Quantity
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Total Price
										</th>
										<th className="text-sm md:text-base border border-gray-200 p-1 sm:p-2">
											Remove
										</th>
									</tr>
								</thead>
								<tbody>
									{data.map((item, index) => {
										const images =
											item.product?.images && item.product.images !== null
												? JSON.parse(item.product.images)[0]
												: null

										return images === null ? (
											<tr key={`${item.id}-${index}`}>
												<td colSpan={7} className="text-center py-4">
													<LoadingComponent />
												</td>
											</tr>
										) : (
											<tr
												key={`${item.id}-${index}`}
												className="border-b border-gray-200 hover:bg-gray-100 text-sm md:text-base"
											>
												<td className="text-center py-2 border-r border-gray-200">
													<input
														type="checkbox"
														checked={selectedItems.includes(item.id)}
														onChange={() => toggleSelectItem(item.id)}
													/>
												</td>
												<td className="py-2 border-r border-gray-200">
													<img
														className="h-10 w-10 sm:w-12 sm:h-12 mx-auto"
														src={`http://127.0.0.1:8000/${images}`}
														alt={item.product.brand}
													/>
												</td>
												<td className="text-center py-2 border-r border-gray-200">
													<p className="line-clamp-2">{item.product.name}</p>
												</td>
												<td className="text-center p-2 border-r border-gray-200">
													₱{numberFormat(item.product.selling_price)}
												</td>
												<td className="p-2 border-r border-gray-200">
													<div className="flex justify-center items-center">
														<button
															className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-l"
															onClick={() => handleDecrement(item, item.id)}
														>
															-
														</button>
														<input
															type="text"
															className="w-12 py-1 text-center outline-none border-1"
															value={item.product_quantity}
															readOnly
														/>
														<button
															className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-r"
															onClick={() => handleIncrement(item, item.id)}
														>
															+
														</button>
													</div>
												</td>
												<td className="text-center py-2 border-r border-gray-200">
													₱
													{numberFormat(
														item.product_quantity * item.product.selling_price
													)}
												</td>
												<td className="px-2 text-center">
													<button
														className="text-red-500 bg-red-200 p-2 rounded"
														onClick={(e) => deleteCartItemButton(e, item.id)}
													>
														<FaTrash size={20} />
													</button>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Checkout and Grand Total */}
				<div className="flex flex-col items-end pr-4">
					<h4 className="text-lg sm:text-xl font-semibold mx-4 mt-2">
						Grand Total: ₱{numberFormat(totalGrandPrice)}
					</h4>
					{selectedItems.length === 0 ? (
						<p className="text-orange-500 text-l text-center font-semibold mx-4 py-2">
							Select items to checkout
						</p>
					) : (
						<Link
							to="/checkout"
							state={{ selectedItems, totalGrandPrice }}
							className="bg-blue-600 text-white px-6 py-2 mx-4 mb-3 rounded"
						>
							Checkout
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default Cart
