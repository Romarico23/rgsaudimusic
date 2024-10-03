import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import emailjs from "@emailjs/browser"

function Contact() {
	const schema = yup.object().shape({
		full_name: yup.string().required("Full name is required"),
		email_address: yup
			.string()
			.email("Enter a valid email")
			.required("Email address is required"),
		mobile_number: yup
			.string()
			.matches(/^[0-9]+$/, "Mobile number must be numeric")
			.min(10, "Mobile number must be at least 10 digits")
			.nullable(),
		email_subject: yup.string().required("Email subject is required"),
		message: yup.string().required("Message is required"),
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	})

	const onSubmit = (data) => {
		emailjs
			.sendForm(
				import.meta.env.VITE_APP_SERVICE_ID,
				import.meta.env.VITE_APP_TEMPLATE_ID,
				"#contact-Form",
				import.meta.env.VITE_APP_PUBLIC_KEY
			)
			.then(
				(result) => {
					console.log(result.text)
					alert("Email Sent!")
					reset()
				},
				(error) => {
					console.log(error.text)
				}
			)
	}

	useEffect(() => {
		document.title = "Contact"
	}, [])

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl mb-4">Contact Us</h1>
			<form
				id="contact-Form"
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4"
			>
				<div>
					<label className="block">Full Name</label>
					<input
						{...register("full_name")}
						className={`border p-2 w-full ${
							errors.full_name ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.full_name && (
						<span className="text-red-500">{errors.full_name.message}</span>
					)}
				</div>
				<div>
					<label className="block">Email Address</label>
					<input
						{...register("email_address")}
						className={`border p-2 w-full ${
							errors.email_address ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.email_address && (
						<span className="text-red-500">{errors.email_address.message}</span>
					)}
				</div>
				<div>
					<label className="block">Mobile Number</label>
					<input
						{...register("mobile_number")}
						className={`border p-2 w-full ${
							errors.mobile_number ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.mobile_number && (
						<span className="text-red-500">{errors.mobile_number.message}</span>
					)}
				</div>
				<div>
					<label className="block">Email Subject</label>
					<input
						{...register("email_subject")}
						className={`border p-2 w-full ${
							errors.email_subject ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.email_subject && (
						<span className="text-red-500">{errors.email_subject.message}</span>
					)}
				</div>
				<div>
					<label className="block">Message</label>
					<textarea
						{...register("message")}
						className={`border p-2 w-full ${
							errors.message ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.message && (
						<span className="text-red-500">{errors.message.message}</span>
					)}
				</div>
				<button
					type="submit"
					className="bg-blue-600 text-white px-8 py-2 rounded"
				>
					Send
				</button>
			</form>
			{/* Contact Details Section */}
			<div className="mt-8 bg-gray-100 p-4 rounded">
				<h2 className="text-xl mb-2">Contact Details</h2>
				<p className="mb-2">
					<strong>Mobile Number:</strong> +63905-884-6618
				</p>
				<p className="mb-2">
					<strong>Email Address:</strong> rgsaudimusic@gmail.com
				</p>
				<p className="mb-2">
					<strong>Address:</strong> 22B Road 9 Street, Brgy. Bagong Pagasa,
					Quezon City, Philippines
				</p>
			</div>
		</div>
	)
}

export default Contact
