import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import LoadingComponent from "../../../components/common/LoadingComponent"
import ErrorFetching from "../../../components/common/ErrorFetching"
import {
	allCategory,
	editProduct,
	updateProduct,
} from "../../../core/services/api"
import { removeCommas } from "../../../core/utils/priceUtils"

function EditProduct() {
	const [activeTab, setActiveTab] = useState("home")
	const { id } = useParams()
	const queryClient = useQueryClient()

	const { data: categoryList, isLoading: categoryLoading } = useQuery({
		queryFn: allCategory,
		queryKey: ["categoryList"],
	})

	const {
		data: product,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["editProduct", id],
		queryFn: () => editProduct(id),
	})

	const {
		register: productInput,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm()

	const mutation = useMutation({
		mutationFn: updateProduct,
		onSuccess: (data) => {
			queryClient.invalidateQueries(["editProduct", id])
			Swal.fire("Success", data.message, "success")
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
		const formattedData = {
			...data,
			selling_price: removeCommas(data.selling_price),
			original_price: removeCommas(data.original_price),
		}

		mutation.mutate({ id, data: formattedData })
	}

	useEffect(() => {
		document.title = "Edit Product"
	}, [])

	return isLoading ? (
		<LoadingComponent />
	) : isError ? (
		<ErrorFetching />
	) : (
		<div className="p-2 sm:p-4">
			<h1 className="text-xl font-semibold p-4">Edit Product</h1>
			<form
				onSubmit={handleSubmit(submitProduct)}
				className=" p-4 sm:p-6 bg-white shadow-md rounded-lg text-sm md:text-base"
			>
				<div className="pl-1 sm:p-2 mb-4 sm:mb-auto space-x-2 sm:space-x-6 ">
					<button
						type="button"
						className={` ${
							activeTab === "home" ? "text-blue-500 border-b-2 " : ""
						}`}
						onClick={() => setActiveTab("home")}
					>
						Home
					</button>
					<button
						type="button"
						className={` ${
							activeTab === "seo-tags" ? "text-blue-500 border-b-2" : ""
						}`}
						onClick={() => setActiveTab("seo-tags")}
					>
						SEO-Tags
					</button>
					<button
						type="button"
						className={` ${
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
								defaultValue={product.category_id}
								className="w-full my-1 px-3 py-2 border rounded"
							>
								{categoryLoading
									? ""
									: categoryList.category.map((item) => {
											return (
												<option value={item.id} key={item.id}>
													{item.name}
												</option>
											)
									  })}
							</select>
						</div>
						<div>
							<label>Slug</label>
							<input
								{...productInput("slug")}
								defaultValue={product.slug}
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
								defaultValue={product.name}
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
								defaultValue={product.description}
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
					<div className={`space-y-2 ${activeTab !== "seo-tags" && "hidden"}`}>
						<div>
							<label>Meta Title</label>
							<input
								{...productInput("meta_title")}
								defaultValue={product.meta_title}
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
								defaultValue={product.meta_keywords}
								className="w-full my-1 px-3 py-2 border rounded"
							/>
						</div>
						<div>
							<label>Meta Description</label>
							<textarea
								{...productInput("meta_description")}
								defaultValue={product.meta_description}
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
									defaultValue={product.selling_price}
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
									defaultValue={product.original_price}
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
									defaultValue={product.quantity}
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
									defaultValue={product.brand}
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
									<span className="text-red-500">{errors.images.message}</span>
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
									defaultChecked={product.featured}
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
									defaultChecked={product.popular}
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
									defaultChecked={product.status}
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
	)
}

export default EditProduct
