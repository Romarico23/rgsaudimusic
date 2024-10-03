import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { viewOrders } from "../../../core/services/api"
import LoadingComponent from "../../../components/common/LoadingComponent"
import { Link } from "react-router-dom"
import ErrorFetching from "../../../components/common/ErrorFetching"

function Order() {
	const { data, isLoading, isError } = useQuery({
		queryFn: viewOrders,
		queryKey: ["viewOrdersList"],
	})

	useEffect(() => {
		document.title = "Order"
	}, [])

	if (isLoading) {
		return <LoadingComponent />
	}
	if (isError) {
		return <ErrorFetching />
	}

	return (
		<div className="sm:px-4">
			<div className=" mt-4 bg-white shadow-md rounded-lg">
				<div className=" bg-gray-100 p-4 rounded-t-lg">
					<h4 className="text-xl font-semibold">Order List</h4>
				</div>
				<div className=" p-4 overflow-y-auto">
					{/* Mobile Card View */}
					<div className="block sm:hidden space-y-4 ">
						{data.orders.map((order) => (
							<div
								key={order.id}
								className="space-y-2 border border-gray-200 rounded-lg p-4 bg-white shadow"
							>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Tracking No:</span>
									<span>{order.tracking_no}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Payment Mode:</span>
									<span>{order.payment_mode}</span>
								</div>
								<div className="flex justify-between items-center ">
									<span className="font-semibold">Shipping Address:</span>
									<span className="text-end pl-12 break-all">
										{order.address}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="font-semibold">Status:</span>
									<div
										className={`px-4 py-1 rounded-md text-center ${
											order.status === 0
												? "bg-yellow-300"
												: order.status === 1
												? "bg-blue-300"
												: "bg-green-300"
										}`}
									>
										{order.status === 0
											? "To Ship"
											: order.status === 1
											? "Shipped"
											: "Received"}
									</div>
								</div>
								<div className="flex text-center justify-center">
									<Link
										to={`/admin/edit-order/${order.id}`}
										className="w-full bg-green-500 text-white p-1.5 rounded"
									>
										Action
									</Link>
								</div>
							</div>
						))}
					</div>

					{/* Desktop Table View */}
					<div className="overflow-x-auto hidden sm:block">
						<table className="w-full border-collapse border border-gray-200">
							<thead>
								<tr className="bg-gray-100">
									<th className="border border-gray-200 p-1 sm:p-2">ID</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Tracking No.
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">
										Phone No.
									</th>
									<th className="border border-gray-200 p-1 sm:p-2">Email</th>
									<th className="border border-gray-200 p-1 sm:p-2">Status</th>
									<th className="border border-gray-200 p-1 sm:p-2">Action</th>
								</tr>
							</thead>
							<tbody>
								{data.orders.map((item) => {
									return (
										<tr
											key={item.id}
											className="border-b border-gray-200 hover:bg-gray-100 text-sm md:text-base break-all"
										>
											<td className="text-center px-4 py-2 border-r border-gray-200 break-normal">
												{item.id}
											</td>
											<td className="p-2 border-r border-gray-200">
												{item.tracking_no}
											</td>
											<td className="p-2 border-r border-gray-200">
												{item.phone}
											</td>
											<td className="p-2 border-r border-gray-200">
												{item.email}
											</td>
											<td className="p-2 border-r border-gray-200">
												<div
													className={`p-1.5 rounded-md text-center  line-clamp-1 break-normal ${
														item.status === 0
															? "bg-yellow-300"
															: item.status === 1
															? "bg-blue-300"
															: "bg-green-300"
													}`}
												>
													{item.status === 0
														? "To Ship"
														: item.status === 1
														? "Shipped"
														: "Received"}
												</div>
											</td>
											<td className="text-center border-r border-gray-200">
												<Link
													to={`/admin/edit-order/${item.id}`}
													className="bg-green-500 text-white p-1.5 rounded"
												>
													Action
												</Link>
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

export default Order
