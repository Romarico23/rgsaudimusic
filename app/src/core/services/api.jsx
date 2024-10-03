import axios from "axios"

// Admin Api
export const addCategory = async (data) => {
	const response = await axios.post("/api/add-category", data)
	return response.data
}

export const viewCategory = async () => {
	const response = await axios.get("/api/view-category")
	return response.data
}

export const deleteCategory = async (id) => {
	const response = await axios.delete(`/api/delete-category/${id}`)
	return response.data
}

export const editCategory = async (id) => {
	const response = await axios.get(`/api/edit-category/${id}`)
	return response.data.category
}

export const updateCategory = async ({ id, data }) => {
	const response = await axios.post(`/api/update-category/${id}`, data)
	return response.data
}

export const allCategory = async () => {
	const response = await axios.get("/api/all-category")
	return response.data
}

// Product
export const addProduct = async (data) => {
	const response = await axios.post("/api/add-product", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return response.data
}

export const viewProduct = async () => {
	const response = await axios.get("/api/view-product")
	return response.data
}

export const editProduct = async (id) => {
	const response = await axios.get(`/api/edit-product/${id}`)
	return response.data.product
}

export const updateProduct = async ({ id, data }) => {
	const response = await axios.post(`/api/update-product/${id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return response.data
}

export const deleteProduct = async (id) => {
	const response = await axios.delete(`/api/delete-product/${id}`)
	return response.data
}

// Orders
export const viewOrders = async () => {
	const response = await axios.get("/api/view-order")
	return response.data
}

export const editOrder = async (id) => {
	const response = await axios.get(`/api/edit-order/${id}`)
	return response.data.order
}

export const updateOrder = async ({ id, data }) => {
	const response = await axios.put(`/api/update-order/${id}`, data)
	return response.data
}

export const viewOrderItems = async () => {
	const response = await axios.get("/api/viewOrderItems")
	return response.data.ordersWithOrderItems
}

export const countVisit = async () => {
	const response = await axios.post("/api/visits")
	return response.data
}

// Visits
export const getVisitCount = async () => {
	const response = await axios.get("/api/visits-total")
	return response.data
}

export const getMonthlyVisitCount = async () => {
	const response = await axios.get("/api/visits-monthly")
	return response.data
}

// Mark notification as read
export const editNotifStatus = async (orderId) => {
	const response = await axios.post(`/api/edit-notif-status/${orderId}`)
	return response.data
}

// -------------------------------------------------------------------------------------
// User Api

// Instruments
export const getCategory = async () => {
	const response = await axios.get("/api/getCategory")
	return response.data.category
}

export const fetchProduct = async (slug) => {
	const response = await axios.get(`/api/fetchProduct/${slug}`)
	return response.data.product_data
}

export const viewProductDetail = async (category_slug, product_slug) => {
	const response = await axios.get(
		`/api/viewProductDetail/${category_slug}/${product_slug}`
	)
	return response.data.product
}

export const addToCart = async (data) => {
	const response = await axios.post(`/api/add-to-cart`, data)
	return response.data
}

// Cart
export const viewCart = async () => {
	const response = await axios.get("/api/cart")
	return response.data.cart
}

export const updateCartQuantity = async ({ cart_id, scope }) => {
	const response = await axios.post(
		`/api/cart-update-quantity/${cart_id}/${scope}`
	)
	return response.data
}

export const deleteCartItem = async (cart_id) => {
	const response = await axios.delete(`/api/delete-cartItem/${cart_id}`)
	return response.data
}

// Checkout
export const placeOrder = async (orderData) => {
	const response = await axios.post(`/api/place-order`, orderData)
	return response.data
}

// Order Items/Products
export const viewUserOrderItems = async () => {
	const response = await axios.get("/api/viewUserOrderItems")
	return response.data.userProductReview
}

export const validateOrder = async (orderData) => {
	const response = await axios.post("/api/validate-order", orderData)
	return response.data
}

// Home
export const viewAllProducts = async () => {
	const response = await axios.get("/api/viewAllProducts")
	return response.data.products
}

// Search
export const productsSearch = async (query) => {
	const response = await axios.get("/api/products-search", {
		params: { query },
	})
	return response.data.products
}

// Review
export const addReview = async (reviewData) => {
	const { data } = await axios.post("/api/reviews", reviewData)
	return data
}

export const getProductReviews = async () => {
	const { data } = await axios.get("/api/product-reviews")
	return data
}

// Conversion Rate Api
export const fetchConversionRate = async (
	baseCurrency = "PHP",
	targetCurrency = "USD"
) => {
	try {
		const response = await fetch(
			`https://api.exchangerate-api.com/v4/latest/${baseCurrency}` // Or use your preferred API
		)
		const data = await response.json()
		return data.rates[targetCurrency]
	} catch (error) {
		console.error("Failed to fetch conversion rate", error)
		return 0.0175 // Fallback to a fixed rate if the API call fails
	}
}
