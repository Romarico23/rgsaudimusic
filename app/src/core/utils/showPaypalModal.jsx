import React from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { createRoot } from "react-dom/client"
import Swal from "sweetalert2"

export const showPayPalModal = ({
	usdTotalGrandPrice,
	placeOrderMutation,
	orderData,
}) => {
	Swal.fire({
		title: "Pay Online",
		html: `
        <div id="paypal-button-container" style="min-height: 80px;"></div>
      `,
		showCancelButton: true,
		showConfirmButton: false,
		didOpen: () => {
			const paypalButtonContainer = document.getElementById(
				"paypal-button-container"
			)

			if (paypalButtonContainer) {
				const root = createRoot(paypalButtonContainer)

				const paypalScriptOptions = {
					"client-id": import.meta.env.VITE_APP_PAYPAL_CLIENT_ID,
					currency: "USD",
					intent: "capture",
				}

				root.render(
					<PayPalScriptProvider options={paypalScriptOptions}>
						<PayPalButtons
							style={{
								layout: "horizontal",
								height: 40,
								tagline: false,
								label: "pay",
							}}
							createOrder={(data, actions) => {
								console.log(orderData)

								return actions.order.create({
									purchase_units: [
										{
											amount: {
												value: usdTotalGrandPrice,
											},
										},
									],
								})
							}}
							onApprove={async (data, actions) => {
								const orderinfo_data = {
									firstname: orderData.firstname,
									lastname: orderData.lastname,
									phone: orderData.phone,
									email: orderData.email,
									address: orderData.address,
									city: orderData.city,
									state: orderData.state,
									zipcode: orderData.zipcode,
									payment_mode: data.paymentSource,
									payment_id: data.orderID,
								}
								const combinedOrderData = {
									...orderinfo_data,
									order_items: [...orderData.order_items],
								}
								placeOrderMutation.mutate(combinedOrderData)
								Swal.close()
							}}
							onError={(err) => {
								Swal.fire(
									"Error",
									"PayPal payment failed. Please try again.",
									"error"
								)
							}}
						/>
					</PayPalScriptProvider>
				)
			}
		},
	})
}
