import React, { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { registerUser } from "../../../core/services/auth"

function Register() {
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			Cookies.set("auth_token", data.token, {
				secure: true,
				sameSite: "Strict",
			})
			Cookies.set("auth_name", data.name)
			Swal.fire("Success", data.message, "success")
			navigate("/", { replace: true })
		},
		onError: (error) => {
			// Swal.fire("Error", "There was an error registering the user!", "error")
			Object.keys(error.response.data.validation_error).forEach((field) => {
				setError(field, {
					type: "manual",
					message: error.response.data.validation_error[field].join(" "),
				})
			})
		},
	})

	useEffect(() => {
		document.title = "Register"
	}, [])

	const onSubmit = (data) => {
		const formData = new FormData()
		formData.append("name", data.name)
		formData.append("email", data.email)
		formData.append("password", data.password)
		formData.append("password_confirmation", data.password_confirmation)
		formData.append("image", data.image[0])
		mutation.mutate(formData)
	}

	return (
		<div>
			<h1 className="py-10 text-center text-2xl font-bold">Register Account</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-md mx-auto p-4 shadow-md rounded"
			>
				<div className="mb-4">
					<label className="block text-gray-700">Name</label>
					<input
						{...register("name")}
						className="w-full px-3 py-2 border rounded"
					/>
					{errors.name && (
						<span className="text-red-500">{errors.name.message}</span>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Email</label>
					<input
						type="email"
						{...register("email")}
						className="w-full px-3 py-2 border rounded"
					/>
					{errors.email && (
						<span className="text-red-500">{errors.email.message}</span>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Password</label>
					<input
						type="password"
						{...register("password")}
						className="w-full px-3 py-2 border rounded"
					/>
					{errors.password && (
						<span className="text-red-500">{errors.password.message}</span>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Confirm Password</label>
					<input
						type="password"
						{...register("password_confirmation")}
						className="w-full px-3 py-2 border rounded"
					/>
					{errors.password_confirmation && (
						<span className="text-red-500">
							{errors.password_confirmation.message}
						</span>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Profile Image</label>
					<input
						type="file"
						{...register("image")}
						className="w-full px-3 py-2 border rounded"
					/>
					{errors.image && (
						<span className="text-red-500">{errors.image.message}</span>
					)}
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded"
					disabled={mutation.isPending}
				>
					{mutation.isPending ? "Loading..." : "Register"}
				</button>
				<div className="flex gap-1.5 pt-3">
					<h1>Already have an account? </h1>
					<Link to={"/login"} className="text-blue-500">
						Login Now
					</Link>
				</div>
			</form>
		</div>
	)
}

export default Register
