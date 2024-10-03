import { useMutation } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { addCategory } from "../../../core/services/api"

function AddCategory() {
	const [activeTab, setActiveTab] = useState("home")
	const {
		register: categoryInput,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: addCategory,
		onSuccess: (data) => {
			Swal.fire("Success", data.message, "success")
			reset()
		},
		onError: (error) => {
			Object.keys(error.response.data.errors).forEach((field) => {
				setError(field, {
					type: "manual",
					message: error.response.data.errors[field].join(" "),
				})
			})
		},
	})

	const submitCategory = (data) => {
		const formData = new FormData()
		formData.append("meta_title", data.meta_title)
		formData.append("meta_keywords", data.meta_keywords)
		formData.append("meta_description", data.meta_description)
		formData.append("slug", data.slug)
		formData.append("name", data.name)
		formData.append("description", data.description)
		formData.append("status", data.status ? "1" : "0")
		mutation.mutate(formData)
	}

	useEffect(() => {
		document.title = "Add Category"
	}, [])

	return (
		<div className="p-2 sm:p-4">
			<h1 className="text-xl font-semibold p-4">Add Category</h1>
			<form
				onSubmit={handleSubmit(submitCategory)}
				className=" p-4 sm:p-6 bg-white shadow-md rounded-lg text-sm md:text-base"
			>
				<div className="pl-1 sm:p-2 mb-4 sm:mb-auto space-x-2 sm:space-x-6 ">
					<button
						type="button"
						className={`${
							activeTab === "home" ? "text-blue-500 border-b-2 " : ""
						}`}
						onClick={() => setActiveTab("home")}
					>
						Home
					</button>
					<button
						type="button"
						className={`${
							activeTab === "seo-tags" ? "text-blue-500 border-b-2" : ""
						}`}
						onClick={() => setActiveTab("seo-tags")}
					>
						SEO-Tags
					</button>
				</div>
				<div className="p-1 text-gray-700">
					<div className={`space-y-2 ${activeTab !== "home" && "hidden"}`}>
						<div>
							<label>Slug</label>
							<input
								{...categoryInput("slug")}
								className="w-full my-1 px-3 py-2 border rounded"
							/>
							{errors.slug && (
								<span className="text-red-500">{errors.slug.message}</span>
							)}
						</div>
						<div>
							<label>Name</label>
							<input
								{...categoryInput("name")}
								className="w-full my-1 px-3 py-2 border rounded"
							/>
							{errors.name && (
								<span className="text-red-500">{errors.name.message}</span>
							)}
						</div>
						<div>
							<label>Description</label>
							<textarea
								{...categoryInput("description")}
								className="w-full my-1 px-3 py-2 border rounded"
								rows="3"
							></textarea>
						</div>
						<div>
							<input type="checkbox" {...categoryInput("status")} /> Status
							0-shown/1-hidden
						</div>
					</div>
					<div className={`space-y-2 ${activeTab !== "seo-tags" && "hidden"}`}>
						<div>
							<label>Meta Title</label>
							<input
								{...categoryInput("meta_title")}
								className="w-full my-1 px-3 py-2 border rounded"
							/>
							{errors.meta_title && (
								<span className="text-red-500">
									{errors.meta_title.message}
								</span>
							)}
						</div>
						<div>
							<label>Meta Keywords</label>
							<input
								{...categoryInput("meta_keywords")}
								className="w-full my-1 px-3 py-2 border rounded"
							/>
						</div>
						<div>
							<label>Meta Description</label>
							<textarea
								{...categoryInput("meta_description")}
								className="w-full mt-1 mb-2 px-3 py-2 border rounded"
								rows="3"
							></textarea>
						</div>
					</div>
				</div>
				<div className="flex justify-center mt-4 sm:justify-end">
					<button
						type="submit"
						className="bg-blue-500 text-white py-2 px-8 rounded w-full sm:w-auto"
					>
						{mutation.isPending ? "Submitting" : "Submit"}
					</button>
				</div>
			</form>
		</div>
	)
}

export default AddCategory
