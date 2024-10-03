import { useMutation, useQueryClient } from "@tanstack/react-query"
import Swal from "sweetalert2"
import { addToCart } from "../services/api"

export const useAddToCart = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: addToCart,
		onMutate: async (cartData) => {
			await queryClient.cancelQueries(["cart"]) // Cancel ongoing refetches

			const previousCart = queryClient.getQueryData(["cart"]) // Snapshot of previous cart

			// Optimistically update the cart data
			queryClient.setQueryData(["cart"], (old) => {
				const newCart = old ? [...old] : [] // If old cart data doesn't exist, return an empty array
				newCart.push({
					product_id: cartData.product_id,
					product_quantity: cartData.product_quantity,
				})
				return newCart
			})

			return { previousCart } // Return context for rollback
		},
		onError: (error, cartData, context) => {
			// Rollback to the previous cart data on error
			queryClient.setQueryData(["cart"], context.previousCart)
			Swal.fire("Error", error.response.data.message, "error")
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries(["cart"])
			// Swal.fire("Success", data.message, "success")
		},
	})

	return mutation
}
