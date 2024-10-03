import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../services/auth"

export const useLogoutMutation = () => {
	const navigate = useNavigate()

	return useMutation({
		mutationFn: logoutUser,
		onSuccess: (data) => {
			Cookies.remove("auth_token")
			Cookies.remove("auth_name")
			Swal.fire("Success", data.message, "success")
			navigate("/login", { replace: true })
		},
		onError: () => {
			Swal.fire("Error", "Error logging out", "error")
		},
	})
}
