import axios from "axios"

export const loginUser = async (loginData) => {
	await axios.get("/sanctum/csrf-cookie")
	const response = await axios.post("/api/login", loginData)
	return response.data
}

export const registerUser = async (registerData) => {
	await axios.get("/sanctum/csrf-cookie")
	const response = await axios.post("/api/register", registerData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
	return response.data
}

export const fetchAuthStatus = async () => {
	const response = await axios.get("/api/checking-authenticated")
	return response.status === 200
}

// User Profile
export const userProfile = async () => {
	const response = await axios.get("/api/userProfile")
	return response.data.user
}

export const logoutUser = async () => {
	const response = await axios.post("/api/logout")
	return response.data
}
