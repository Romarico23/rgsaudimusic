import React, { act, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Swal from "sweetalert2"
import {
	fetchConversionRate,
	placeOrder,
	validateOrder,
	viewCart,
} from "../../core/services/api"
import LoadingComponent from "../../components/common/LoadingComponent"
import { numberFormat } from "../../core/utils/priceUtils"
import ErrorFetching from "../../components/common/ErrorFetching"
import { showPayPalModal } from "../../core/utils/showPaypalModal"

function Checkout() {
	const navigate = useNavigate()
	const stripe = useStripe()
	const elements = useElements()
	const queryClient = useQueryClient()

	const location = useLocation()
	const { selectedItems, totalGrandPrice } = location.state || {
		selectedItems: [],
		totalGrandPrice: 0,
	}
	const [paymentLoadingState, setPaymentLoadingState] = useState({
		cod: false,
		stripepay: false,
		payonline: false,
	})

	const [conversionRate, setConversionRate] = useState(0)
	const usdTotalGrandPrice = Math.round(totalGrandPrice * conversionRate)

	const {
		data: cart,
		isLoading,
		isError,
	} = useQuery({ queryKey: ["cart"], queryFn: viewCart })

	const selectedCartItems = cart
		? cart.filter((item) => selectedItems.includes(item.id))
		: []

	const {
		register,
		handleSubmit,
		getValues,
		setError,
		reset,
		formState: { errors },
	} = useForm()

	const placeOrderMutation = useMutation({
		mutationFn: placeOrder,
		onSuccess: (data) => {
			Swal.fire("Order Placed Successfully", data.message, "success")
			queryClient.invalidateQueries(["cart"])
			queryClient.invalidateQueries(["viewUserOrderItems"])
			reset()
			navigate("/thank-you")
		},
		onError: (error) => {
			setPaymentLoadingState({ cod: false, stripepay: false, payonline: false })

			if (error.response.status === 401) {
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

	// const placeOrderMutation = useMutation({
	// 	mutationFn: placeOrder,
	// 	onMutate: async () => {
	// 		// Cancel any ongoing queries for cart and order items
	// 		await queryClient.cancelQueries(["cart"])
	// 		await queryClient.cancelQueries(["viewUserOrderItems"])

	// 		// Get the previous state for both cart and order items
	// 		const previousCart = queryClient.getQueryData(["cart"])
	// 		const previousOrderItems = queryClient.getQueryData([
	// 			"viewUserOrderItems",
	// 		])

	// 		// Return the previous states to rollback in case of error
	// 		return { previousCart, previousOrderItems }
	// 	},
	// 	onSuccess: (data) => {
	// 		// Only clear the cart and update order items upon success
	// 		queryClient.setQueryData(["cart"], () => [])
	// 		queryClient.setQueryData(["viewUserOrderItems"], (old) => [
	// 			...(old || []),
	// 			{
	// 				/* new order item data from the mutation response */
	// 			},
	// 		])

	// 		// Show success message
	// 		Swal.fire("Order Placed Successfully", data.message, "success")

	// 		// Invalidate queries to refetch the latest data
	// 		queryClient.invalidateQueries(["cart"])
	// 		queryClient.invalidateQueries(["viewUserOrderItems"])

	// 		// Reset the form
	// 		reset()

	// 		// Navigate to thank-you page
	// 		navigate("/thank-you")
	// 	},
	// 	onError: (error, variables, context) => {
	// 		// Rollback to previous states if mutation fails
	// 		queryClient.setQueryData(["cart"], context.previousCart)
	// 		queryClient.setQueryData(
	// 			["viewUserOrderItems"],
	// 			context.previousOrderItems
	// 		)

	// 		// Handle error and display validation messages
	// 		Object.keys(error.response.data.errors).forEach((field) => {
	// 			setError(field, {
	// 				type: "manual",
	// 				message: error.response.data.errors[field].join(" "),
	// 			})
	// 		})
	// 	},
	// 	onSettled: () => {
	// 		// Always refetch cart and order items after mutation is done (success or error)
	// 		queryClient.invalidateQueries(["cart"])
	// 		queryClient.invalidateQueries(["viewUserOrderItems"])
	// 	},
	// })

	const validateOrderMutation = useMutation({
		mutationFn: async (orderData) => {
			const response = await validateOrder(orderData)

			if (orderData.payment_mode === "stripepay") {
				const clientSecret = response.clientSecret

				// Confirm Stripe card payment
				const { error, paymentIntent } = await stripe.confirmCardPayment(
					clientSecret,
					{
						payment_method: {
							card: elements.getElement(CardElement),
						},
					}
				)
				if (error) {
					throw new Error(error.message)
				}
				return { paymentIntent, orderData }
			} else if (orderData.payment_mode === "payonline") {
				return { orderData }
			}
		},
		onSuccess: ({ paymentIntent, orderData }) => {
			if (orderData.payment_mode === "stripepay") {
				orderData.payment_id = paymentIntent.id
				placeOrderMutation.mutate(orderData)
			} else if (orderData.payment_mode === "payonline") {
				return showPayPalModal({
					usdTotalGrandPrice,
					orderData,
					placeOrderMutation,
				})
			}
		},
		onError: (error) => {
			setPaymentLoadingState({ cod: false, stripepay: false, payonline: false }) // Reset loading state on error
			if (error.response && error.response.data.errors) {
				Object.keys(error.response.data.errors).forEach((field) => {
					setError(field, {
						type: "manual",
						message: error.response.data.errors[field].join(" "),
					})
				})
			} else {
				Swal.fire("Payment Error", error.message, "error")
			}
		},
	})

	const handlePaymentMode = async (data, paymentMode) => {
		if (selectedCartItems.length < 1) {
			return Swal.fire(
				"Order is Empty",
				"Please select items to your cart before proceeding to checkout.",
				"error"
			)
		}

		setPaymentLoadingState((prev) => ({ ...prev, [paymentMode]: true })) // Set loading state for the clicked button

		const orderData = {
			...data,
			payment_mode: paymentMode,
			payment_id: "",
			amount: usdTotalGrandPrice,
			order_items: selectedCartItems.map((item) => ({
				cart_id: item.id,
				product_id: item.product_id,
				quantity: item.product_quantity,
				price: item.product.selling_price,
			})),
		}

		switch (paymentMode) {
			case "cod":
				placeOrderMutation.mutate(orderData)
				break

			case "stripepay":
				if (stripe && elements) {
					validateOrderMutation.mutate(orderData)
				}
				break

			case "payonline":
				validateOrderMutation.mutate(orderData)

				break

			default:
				break
		}
	}

	const onSubmit = async (data) => {
		const rate = await fetchConversionRate("PHP", "USD")
		setConversionRate(rate)
		handlePaymentMode(data, "")
	}

	useEffect(() => {
		fetchConversionRate("PHP", "USD").then(setConversionRate)
		document.title = "Checkout"
	}, [])

	if (isLoading) {
		return <LoadingComponent />
	}

	if (isError) {
		return <ErrorFetching />
	}

	return (
		<div className="container mx-auto p-4">
			{/* <div className="flex items-center flex-col 2xl:flex-row"> */}
			<div className="xl:flex items-center xl justify-center  2xl:flex-row">
				{/* <div className="md:w-2/3 sm:p-4"> */}
				<div className="w-full sm:p-4">
					<h2 className="text-2xl font-semibold mb-4">Order Details</h2>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className=" space-y-4 p-6  shadow-md rounded"
					>
						<div className="md:grid md:grid-cols-2 flex flex-col gap-4">
							<div>
								<label className=" text-sm font-medium text-gray-700">
									First Name
								</label>
								<input
									{...register("firstname")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.firstname && (
									<span className="text-red-500 text-sm">
										{errors.firstname.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Last Name
								</label>
								<input
									{...register("lastname")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.lastname && (
									<span className="text-red-500 text-sm">
										{errors.lastname.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Phone Number
								</label>
								<input
									{...register("phone")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.phone && (
									<span className="text-red-500 text-sm">
										{errors.phone.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Email Address
								</label>
								<input
									{...register("email")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.email && (
									<span className="text-red-500 text-sm">
										{errors.email.message}
									</span>
								)}
							</div>
							<div className="col-span-2">
								<label className="block text-sm font-medium text-gray-700">
									Address
								</label>
								<textarea
									{...register("address")}
									className={
										"py-2 px-3 h-20 block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
									rows="3"
								/>
								{errors.address && (
									<span className="text-red-500 text-sm">
										{errors.address.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									City
								</label>
								<input
									{...register("city")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.city && (
									<span className="text-red-500 text-sm">
										{errors.city.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									State
								</label>
								<input
									{...register("state")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.state && (
									<span className="text-red-500 text-sm">
										{errors.state.message}
									</span>
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Zip Code
								</label>
								<input
									{...register("zipcode")}
									className={
										"py-2 px-3 mt- block w-full border-b rounded-md shadow-sm sm:text-sm"
									}
								/>
								{errors.zipcode && (
									<span className="text-red-500 text-sm">
										{errors.zipcode.message}
									</span>
								)}
							</div>
							<div className="my-auto">
								<CardElement
									options={{
										hidePostalCode: true,
										style: {
											base: {
												fontSize: "14px",
											},
										},
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
							<button
								type="submit"
								disabled={
									validateOrderMutation.isPending ||
									placeOrderMutation.isPending
								}
								onClick={() => handlePaymentMode(getValues(), "cod")}
								className="bg-blue-500 text-white py-2 px-4 rounded"
							>
								{paymentLoadingState.cod ? "Loading..." : "Place Order (COD)"}
							</button>
							<button
								type="submit"
								disabled={
									validateOrderMutation.isPending ||
									placeOrderMutation.isPending
								}
								onClick={() => handlePaymentMode(getValues(), "stripepay")}
								className="bg-blue-500 text-white py-2 px-4 rounded"
							>
								{paymentLoadingState.stripepay ? "Loading..." : "Card Payment"}
							</button>
							<button
								type="submit"
								disabled={
									validateOrderMutation.isPending ||
									placeOrderMutation.isPending
								}
								onClick={() => handlePaymentMode(getValues(), "payonline")}
								className="bg-yellow-500 text-white py-2 px-4 rounded"
							>
								{paymentLoadingState.payonline ? "Loading..." : "Pay Online"}
							</button>
						</div>
					</form>
				</div>

				<div className=" pt-4 sm:p-4">
					<h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

					{/* Mobile Card View */}
					<div className="block md:hidden space-y-4">
						{selectedCartItems.map((item) => {
							const sellingPriceNumber = Number(
								item.product.selling_price.replace(/,/g, "")
							)
							const totalCartPrice = item.product_quantity * sellingPriceNumber
							return (
								<div
									key={item.id}
									className="text-right border border-gray-200 rounded-lg p-4 bg-white shadow"
								>
									<div className="flex justify-between items-start">
										<span className="font-semibold">Product:</span>
										<span className="pl-8">{item.product.name}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold">Price:</span>
										<span>₱{numberFormat(item.product.selling_price)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold">Qty:</span>
										<span>{item.product_quantity}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold">Total:</span>
										<span>₱{numberFormat(totalCartPrice)}</span>
									</div>
								</div>
							)
						})}

						{/* Grand Total */}
						<div className="border border-gray-200 rounded-lg p-4 bg-white shadow">
							<div className="flex justify-between items-center font-semibold">
								<span>Grand Total:</span>
								<span>
									{selectedCartItems.length !== 0 &&
										`₱${numberFormat(totalGrandPrice)}`}
								</span>
							</div>
						</div>
					</div>

					{/* Desktop Table View */}
					<table className="hidden md:table min-w-full bg-white border border-gray-200">
						<thead>
							<tr className="bg-gray-100 border-b">
								<th className="py-2 px-4 text-center">Product</th>
								<th className="py-2 px-4 text-center">Price</th>
								<th className="py-2 px-4 text-center">Qty</th>
								<th className="py-2 px-4 text-center">Total</th>
							</tr>
						</thead>
						<tbody>
							{selectedCartItems.map((item) => {
								const sellingPriceNumber = Number(
									item.product.selling_price.replace(/,/g, "")
								)
								const totalCartPrice =
									item.product_quantity * sellingPriceNumber
								return (
									<tr
										key={item.id}
										className="border-b border-gray-200 text-sm sm:text-base"
									>
										<td className="py-2 px-4 border-r border-gray-200">
											{item.product.name}
										</td>
										<td className="py-2 px-4 text-center border-r border-gray-200">
											₱{numberFormat(item.product.selling_price)}
										</td>
										<td className="py-2 px-4 text-center border-r border-gray-200">
											{item.product_quantity}
										</td>
										<td className="py-2 px-4 text-center border-r border-gray-200">
											₱{numberFormat(totalCartPrice)}
										</td>
									</tr>
								)
							})}
							<tr>
								<td colSpan="3" className="py-2 px-4 text-right font-semibold">
									Grand Total:
								</td>
								<td className="py-2 px-4 font-semibold">
									{selectedCartItems.length !== 0 &&
										`₱${numberFormat(totalGrandPrice)}`}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default Checkout
