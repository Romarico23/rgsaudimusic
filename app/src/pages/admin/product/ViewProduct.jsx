import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import ErrorFetching from "../../../components/common/ErrorFetching"
import LoadingComponent from "../../../components/common/LoadingComponent"
import { deleteProduct, viewProduct } from "../../../core/services/api"
import { numberFormat } from "../../../core/utils/priceUtils"
import Swal from "sweetalert2"

function ViewProduct() {
	const queryClient = useQueryClient()

	const { data, isLoading, isError } = useQuery({
		queryFn: viewProduct,
		queryKey: ["productList"],
	})

	const mutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: (data) => {
			queryClient.invalidateQueries(["productList"])
			Swal.fire("Success", data.message, "success")
		},
		onError: (error) => {
			Swal.fire("Error", error.message, "error")
		},
	})

	const deleteButton = (e, id) => {
		mutation.mutate(id)
	}

	useEffect(() => {
		document.title = "View Product"
	}, [])

	return isLoading ? (
		<LoadingComponent />
	) : isError ? (
		<ErrorFetching />
	) : (
		<div className="p-2 sm:px-4">
			<div className=" mt-4 bg-white shadow-md rounded-lg">
				<div className=" bg-gray-100 p-3 sm:p-4 rounded-t-lg">
					<h4 className="flex justify-between items-center text-lg sm:text-xl font-semibold">
						Product List
						<Link
							to="/admin/add-product"
							className="text-base sm:text-lg bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Add Product
						</Link>
					</h4>
				</div>
				<div className=" p-4 overflow-y-auto">
					{/* Mobile Card View */}
					<div className="block sm:hidden space-y-4 ">
						{data.products.map((item) => {
							return (
								<div
									key={item.id}
									className="flex justify-between border border-gray-200 rounded-lg p-4 bg-white shadow"
								>
									<div className="w-full pr-4 text-left text-sm space-y-2">
										<strong>ID: {item.id}</strong>
										<p>
											<strong>{item.name}</strong>
										</p>
										<p>
											<strong>Category Name: </strong>
											{item.category.name}
										</p>
										<p>
											<strong>Price: </strong>₱
											{numberFormat(item.selling_price)}
										</p>
										<p>
											<strong>Stock: </strong>
											{item.quantity}
										</p>
										<div className="flex justify-start">
											<p className="bg-yellow-500 text-white p-1 rounded">
												{item.status === 0 ? "Shown" : "Hidden"}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-center gap-2">
										<img
											className="h-28 w-28"
											src={`http://127.0.0.1:8000/${
												JSON.parse(item.images)[0]
											}`}
											alt={item.name}
										/>
										<div className="flex flex-co text-center gap-1">
											<Link to={`/admin/edit-product/${item.id}`}>
												<button className="bg-green-500 text-white py-1 px-2  rounded">
													Edit
												</button>
											</Link>
											<button
												type="button"
												className="bg-red-500 text-white p-1 rounded"
												disabled={
													mutation.isPending && mutation.variables === item.id
												}
												onClick={(e) => deleteButton(e, item.id)}
											>
												{mutation.isPending && mutation.variables === item.id
													? "Deleting..."
													: "Delete"}
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>

					{/* Desktop Table View */}
					<div className="overflow-x-auto hidden sm:block">
						<table className="w-full border-collapse border border-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="border border-gray-200 p-1 sm:p-2">ID</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Category Name
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Product Name
									</th>
									<th className="border border-gray-200 p- md:p-2">
										Selling Price
									</th>
									<th className="border border-gray-200 p- md:p-2">Stock</th>
									<th className="border border-gray-200 p-1 sm:p-2">Image</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Edit/Delete
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">Status</th>
								</tr>
							</thead>
							<tbody>
								{data.products.map((item) => {
									return (
										<tr
											key={item.id}
											className="border-b border-gray-200 hover:bg-gray-100  text-sm lg:text-base break-all"
										>
											<td className="text-center px-4 py-2 border-r border-gray-200  break-normal">
												{item.id}
											</td>
											<td className="text-center p-2 border-r border-gray-200 break-normal">
												{item.category.name}
											</td>
											<td className="text- p-2 border-r border-gray-200 ">
												{item.name}
											</td>
											<td className="text-center p-2 border-r border-gray-200 break-normal">
												<p className=" md:line-clamp-1">
													₱{numberFormat(item.selling_price)}
												</p>
											</td>
											<td className="text-center p-2 border-r border-gray-200">
												{item.quantity}
											</td>
											<td className="border-r border-gray-200 break-normal">
												<div className="flex items-center justify-center py-2">
													<img
														className="w-12"
														src={`http://127.0.0.1:8000/${
															JSON.parse(item.images)[0]
														}`}
														alt={item.name}
														loading="lazy"
													/>
												</div>
											</td>
											<td className="border-r border-gray-200 break-normal">
												<div className="flex flex-col text-center px-2 space-y-2">
													<Link
														to={`/admin/edit-product/${item.id}`}
														className="bg-green-500 text-white p-1 rounded"
													>
														Edit
													</Link>
													<button
														type="button"
														className="bg-red-500 text-white p-1 rounded"
														disabled={
															mutation.isPending &&
															mutation.variables === item.id
														}
														onClick={(e) => deleteButton(e, item.id)}
													>
														{mutation.isPending &&
														mutation.variables === item.id
															? "Deleting..."
															: "Delete"}
													</button>
												</div>
											</td>
											<td className="border-r border-gray-200 break-normal">
												<div className="text-center bg-yellow-500 rounded p-1.5 mx-1">
													{item.status === 0 ? "Shown" : "Hidden"}
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ViewProduct
