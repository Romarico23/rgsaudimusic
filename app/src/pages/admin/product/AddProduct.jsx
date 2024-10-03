import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
import { addProduct, allCategory } from "../../../core/services/api"
import { removeCommas } from "../../../core/utils/priceUtils"

function AddProduct() {
	const [activeTab, setActiveTab] = useState("home")
	const queryClient = useQueryClient()

	const { data: categoryList, isLoading } = useQuery({
		queryFn: allCategory,
		queryKey: ["categoryList"],
	})

	const {
		register: productInput,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: addProduct,
		onSuccess: (data) => {
			queryClient.invalidateQueries(["productList"])
			Swal.fire("Success", data.message, "success")
			reset()
		},
		onError: (error) => {
			Swal.fire(
				"Error",
				'"An error has occurred. Please check the details."',
				"error"
			)

			Object.keys(error.response.data.errors).forEach((field) => {
				setError(field, {
					type: "manual",
					message: error.response.data.errors[field].join(" "),
				})
			})
		},
	})

	const submitProduct = (data) => {
		const formData = new FormData()
		if (data.images) {
			Array.from(data.images).forEach((image, index) => {
				formData.append(`images[${index}]`, image)
			})
		}
		formData.append("category_id", data.category_id)
		formData.append("slug", data.slug)
		formData.append("name", data.name)
		formData.append("description", data.description)

		formData.append("meta_title", data.meta_title)
		formData.append("meta_keywords", data.meta_keywords)
		formData.append("meta_description", data.meta_description)

		formData.append("selling_price", removeCommas(data.selling_price))
		formData.append("original_price", removeCommas(data.original_price))
		formData.append("quantity", data.quantity)
		formData.append("brand", data.brand)
		formData.append("featured", data.featured ? "1" : "0")
		formData.append("popular", data.popular ? "1" : "0")
		formData.append("status", data.status ? "1" : "0")
		mutation.mutate(formData)
	}

	useEffect(() => {
		document.title = "Add Product"
	}, [])

	return (
		<div className="p-2 sm:p-4">
			<div className="mx-4">
				<h1 className="text-xl font-semibold p-4 ">Add Product</h1>
				<form
					onSubmit={handleSubmit(submitProduct)}
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
						<button
							type="button"
							className={`${
								activeTab === "other-details" ? "text-blue-500 border-b-2" : ""
							}`}
							onClick={() => setActiveTab("other-details")}
						>
							Other Details
						</button>
					</div>

					<div className="p-1 text-gray-700">
						<div className={`space-y-2 ${activeTab !== "home" && "hidden"}`}>
							<div>
								<label>Select Category</label>
								<select
									{...productInput("category_id")}
									className="w-full my-1 px-3 py-2 border rounded"
								>
									{isLoading
										? ""
										: categoryList.category.map((item) => {
												return (
													<option value={item.id} key={item.id}>
														{item.name}
													</option>
												)
										  })}
								</select>
								{errors.category_id && (
									<span className="text-red-500">Select Category</span>
								)}
							</div>
							<div>
								<label>Slug</label>
								<input
									{...productInput("slug")}
									className="w-full my-1 px-3 py-2 border rounded"
								/>
								{errors.slug && (
									<span className="text-red-500">{errors.slug.message}</span>
								)}
							</div>
							<div>
								<label>Name</label>
								<input
									{...productInput("name")}
									className="w-full my-1 px-3 py-2 border rounded"
								/>
								{errors.name && (
									<span className="text-red-500">{errors.name.message}</span>
								)}
							</div>
							<div>
								<label>Description</label>
								<textarea
									{...productInput("description")}
									className="w-full my-1 px-3 py-2 border rounded"
									rows="3"
								></textarea>
								{errors.description && (
									<span className="text-red-500">
										{errors.description.message}
									</span>
								)}
							</div>
						</div>
						<div
							className={`space-y-2 ${activeTab !== "seo-tags" && "hidden"}`}
						>
							<div>
								<label>Meta Title</label>
								<input
									{...productInput("meta_title")}
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
									{...productInput("meta_keywords")}
									className="w-full my-1 px-3 py-2 border rounded"
								/>
							</div>
							<div>
								<label>Meta Description</label>
								<textarea
									{...productInput("meta_description")}
									className="w-full mt-1 mb-2 px-3 py-2 border rounded"
									rows="3"
								></textarea>
								{errors.meta_description && (
									<span className="text-red-500">
										{errors.meta_description.message}
									</span>
								)}
							</div>
						</div>
						<div
							className={`space-y-2 ${
								activeTab === "other-details"
									? "flex flex-col items-start"
									: "hidden"
							}`}
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:gap-8 w-full">
								<div className="flex-1">
									<label>Selling Price</label>
									<input
										{...productInput("selling_price")}
										className="w-full my-1 px-3 py-2 border rounded"
									/>
									{errors.selling_price && (
										<span className="text-red-500">
											{errors.selling_price.message}
										</span>
									)}
								</div>
								<div className="flex-1">
									<label>Original Price</label>
									<input
										{...productInput("original_price")}
										className="w-full my-1 px-3 py-2 border rounded"
									/>
									{errors.original_price && (
										<span className="text-red-500">
											{errors.original_price.message}
										</span>
									)}
								</div>
								<div className="flex-1">
									<label>Quantity</label>
									<input
										{...productInput("quantity")}
										className="w-full my-1 px-3 py-2 border rounded"
									/>
									{errors.quantity && (
										<span className="text-red-500">
											{errors.quantity.message}
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-4 sm:flex-row sm:gap-8 w-full">
								<div className="flex-1">
									<label>Brand</label>
									<input
										{...productInput("brand")}
										className="w-full my-1 px-3 py-2 border rounded"
									/>
									{errors.brand && (
										<span className="text-red-500">{errors.brand.message}</span>
									)}
								</div>
								<div className="flex-1">
									<label>Images</label>
									<input
										type="file"
										{...productInput("images")}
										multiple
										className="w-full my-1 px-3 py-1.5 border rounded"
									/>
									{errors.images && (
										<span className="text-red-500">
											{errors.images.message}
										</span>
									)}
								</div>
							</div>
							<div className="w-full space-y-6 sm:space-y-0 p-2 sm:flex sm:items-center sm:justify-center sm:gap-10 md:gap-16 lg:gap-40 xl:gap-72">
								<div className="flex justify-between sm:flex-col items-center">
									<label className="flex flex-col text-gray-700 text-center">
										<p>Featured (checked=shown)</p>
										{errors.featured && (
											<span className="text-red-500">
												{errors.featured.message}
											</span>
										)}
									</label>
									<input
										type="checkbox"
										{...productInput("featured")}
										className="w-5 h-5"
									/>
								</div>

								<div className="flex justify-between sm:flex-col items-center">
									<label className="flex flex-col text-gray-700 text-center">
										<p>Popular (checked=shown)</p>
										{errors.popular && (
											<span className="text-red-500">
												{errors.popular.message}
											</span>
										)}
									</label>
									<input
										type="checkbox"
										{...productInput("popular")}
										className="w-5 h-5"
									/>
								</div>

								<div className="flex justify-between sm:flex-col items-center">
									<label className="flex flex-col text-gray-700 text-center">
										<p>Status (checked=Hiddden)</p>
										{errors.status && (
											<span className="text-red-500">
												{errors.status.message}
											</span>
										)}
									</label>
									<input
										type="checkbox"
										{...productInput("status")}
										className="w-5 h-5"
									/>
								</div>
							</div>
						</div>
						<div className="flex justify-center mt-4 sm:justify-end">
							<button
								type="submit"
								className="bg-blue-500 text-white py-2 px-8 rounded w-full sm:w-auto"
								disabled={mutation.isPending}
							>
								{mutation.isPending ? "Submitting" : "Submit"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddProduct
