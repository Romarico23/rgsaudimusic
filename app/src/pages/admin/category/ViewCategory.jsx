import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import ErrorFetching from "../../../components/common/ErrorFetching"
import LoadingComponent from "../../../components/common/LoadingComponent"
import { deleteCategory, viewCategory } from "../../../core/services/api"

function ViewCategory() {
	const queryClient = useQueryClient()
	const { data, isLoading, isError } = useQuery({
		queryFn: viewCategory,
		queryKey: ["categoryList"],
	})

	const mutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: (data) => {
			queryClient.invalidateQueries(["categoryList"])
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
		document.title = "View Category"
	}, [])

	return isLoading ? (
		<LoadingComponent />
	) : isError ? (
		<ErrorFetching />
	) : (
		<div className="p-2 sm:px-4">
			<div className=" mt-4 bg-white shadow-md rounded-lg">
				<div className=" bg-gray-100 p-2 sm:p-4 rounded-t-lg">
					<h4 className="flex justify-between items-center text-lg sm:text-xl font-semibold">
						Category List
						<Link
							to="/admin/add-category"
							className="text-base sm:text-lg bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Add Category
						</Link>
					</h4>
				</div>
				<div className=" p-4 overflow-y-auto">
					{/* Mobile Card View */}
					<div className="block sm:hidden space-y-4 ">
						{data.category.map((item) => {
							return (
								<div
									key={item.id}
									className="flex justify-between border border-gray-200 rounded-lg p-4 bg-white shadow"
								>
									<div className="w-ful text-left text-sm space-y-2">
										<strong>ID: {item.id}</strong>
										<p>
											<strong>Name: </strong>
											{item.name}
										</p>
										<p>
											<strong>Slug Name: </strong>
											{item.slug}
										</p>
										<p>
											<strong>Status: </strong>
											{item.status === 0 ? "Shown" : "Hidden"}
										</p>
									</div>
									<div className="flex flex-col justify-between items-center">
										<Link to={`/admin/edit-category/${item.id}`}>
											<button className="bg-green-500 text-white py-1.5 px-8 rounded">
												Edit
											</button>
										</Link>
										<div className="flex justify-center items-center">
											<button
												type="button"
												className="bg-red-500 text-white py-1.5 px-6 rounded"
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
									<th className="border border-gray-200 p-1 sm:p-2">Name</th>
									<th className="border border-gray-200 p-1 sm:p-2">Slug</th>
									<th className="border border-gray-200 p-1 sm:p-2">Status</th>
									<th className="border border-gray-200 p-1 sm:p-2">Edit</th>
									<th className="border border-gray-200 p-1 sm:p-2">Delete</th>
								</tr>
							</thead>
							<tbody>
								{data.category.map((item) => {
									return (
										<tr
											key={item.id}
											className="border-b border-gray-200 hover:bg-gray-100  text-sm lg:text-base break-all"
										>
											<td className="text-center px-4 py-2 border-r border-gray-200">
												{item.id}
											</td>
											<td className="px-4 py-2 border-r border-gray-200">
												{item.name}
											</td>
											<td className="px-4 py-2 border-r border-gray-200">
												{item.slug}
											</td>
											<td className="text-center py-2 border-r border-gray-200">
												{item.status === 0 ? "Shown" : "Hidden"}
											</td>
											<td className="flex justify-center py-2 border-r border-gray-200">
												<Link to={`/admin/edit-category/${item.id}`}>
													<button className="bg-green-500 text-white py-1.5 px-8 rounded">
														Edit
													</button>
												</Link>
											</td>
											<td>
												<div className="flex justify-center items-center">
													<button
														type="button"
														className="bg-red-500 text-white py-1.5 px-7 rounded"
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

export default ViewCategory
