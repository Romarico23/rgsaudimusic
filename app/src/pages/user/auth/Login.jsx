import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import Swal from "sweetalert2"
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { loginUser } from "../../../core/services/auth"

function Login() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm()
	const navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			Cookies.set("auth_token", data.token, {
				secure: true,
				sameSite: "Strict",
			})
			Cookies.set("auth_name", data.name)
			data.role === "admin"
				? navigate("/admin/dashboard", { replace: true })
				: navigate("/", { replace: true })
			Swal.fire("Success", data.message, "success")
		},
		onError: (error) => {
			if (error.response.status === 403) {
				Swal.fire("Error", error.response.data.message, "error")
			}
			Object.keys(error.response.data.validation_error).forEach((field) => {
				setError(field, {
					type: "manual",
					message: error.response.data.validation_error[field].join(" "),
				})
			})
		},
	})

	const onSubmit = (data) => {
		mutation.mutate(data)
	}

	useEffect(() => {
		document.title = "Login"
	}, [])

	return (
		<div>
			<h1 className="py-10 text-center text-2xl font-bold">Login Account</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-md mx-auto p-4 shadow-md rounded"
			>
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
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded"
					disabled={mutation.isPending}
				>
					{mutation.isPending ? "Loading..." : "Login"}
				</button>
				<div className="flex gap-1.5 pt-3">
					<h1>Don't have an account? </h1>
					<Link to={"/register"} className="text-blue-500">
						Register Now
					</Link>
				</div>
			</form>
		</div>
	)
}

export default Login
