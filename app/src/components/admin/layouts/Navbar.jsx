import React, { useEffect, useRef, useState } from "react"
import { IoNotificationsOutline } from "react-icons/io5"
import { Link } from "react-router-dom"
import { userProfile } from "../../../core/services/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { editNotifStatus, viewOrderItems } from "../../../core/services/api"
import { formatDate } from "../../../core/utils/dateUtils"
import { numberFormat } from "../../../core/utils/priceUtils"
import Swal from "sweetalert2"

function Navbar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef(null)
	const queryClient = useQueryClient()

	const {
		data: user,
		isLoading,
		isError,
	} = useQuery({
		queryFn: userProfile,
		queryKey: ["userProfile"],
		staleTime: Infinity,
		cacheTime: Infinity,
	})

	const {
		data: orderItems,
		isLoading: orderItemsIsLoading,
		isError: orderItemsIsError,
	} = useQuery({
		queryFn: viewOrderItems,
		queryKey: ["viewOrderItems"],
	})

	const mutation = useMutation({
		mutationFn: editNotifStatus,
		onMutate: async (orderId) => {
			await queryClient.cancelQueries(["viewOrderItems"])
			const previousOrderItems = queryClient.getQueryData(["viewOrderItems"])
			queryClient.setQueryData(["viewOrderItems"], (oldOrderItems) => {
				return oldOrderItems.map((item) =>
					item.id === orderId ? { ...item, notif_status: 1 } : item
				)
			})
			return { previousOrderItems }
		},
		onError: (error, orderId, context) => {
			queryClient.setQueryData(["viewOrderItems"], context.previousOrderItems)
			Swal.fire("Error", error.response.data.message, "error")
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["viewOrderItems"])
			Swal.fire("Error", err.response.data.message, "success")
		},
	})

	const handleNotificationClick = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [dropdownRef])

	return (
		<nav className="p-4 flex justify-between items-center border-b border-gray-100 shadow-md">
			<Link className="ml-3" to="/admin/dashboard">
				<img
					src="/rgs-logo.png"
					alt="Logo"
					className="rounded-full w-14 h-14 object-cover hover:opacity-50 ease-in-out duration-300"
				/>
			</Link>

			<div className="flex items-center gap-6 mr-3">
				<div className="relative" ref={dropdownRef}>
					<button className="relative flex" onClick={handleNotificationClick}>
						<IoNotificationsOutline className="text-3xl text-gray-600 hover:text-blue-300 ease-in-out duration-300" />
						{orderItems &&
							orderItems.filter((item) => item.notif_status === 0).length >
								0 && (
								<span className="absolute flex items-center justify-center left-[1rem] bottom-[1rem] h-5 w-5 bg-red-500 text-white rounded-full text-xs font-semibold">
									{orderItems.filter((item) => item.notif_status === 0).length}
								</span>
							)}
					</button>

					{isDropdownOpen && (
						<div className="absolute top-full right-0 w-56 md:w-96 bg-white border border-gray-200 rounded-md shadow-lg z-10 notification-dropdown">
							{orderItemsIsLoading && <p>Loading...</p>}
							{orderItemsIsError && <p>Error fetching data.</p>}
							{orderItems && orderItems.length > 0 ? (
								<div className="max-h-60 overflow-y-auto">
									{orderItems.map((item) => (
										<div
											key={item.id}
											className={`p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
												item.notif_status === 1 ? "opacity-50 " : "text-red-500"
											}`}
										>
											<Link
												to={`/admin/edit-order/${item.id}`}
												onClick={(e) => {
													if (!mutation.isPending) {
														mutation.mutate(item.id)
													}
												}}
											>
												{item.notif_status === 0 && (
													<p className="font-bold">New Order </p>
												)}
												<p>
													{item.firstname} - ₱
													{numberFormat(
														item.order_items.reduce(
															(total, orderItem) =>
																total + orderItem.quantity * orderItem.price,
															0
														)
													)}
												</p>
												<p>{formatDate(item.created_at)}</p>
											</Link>
										</div>
									))}
								</div>
							) : (
								<p className="p-2">No orders found.</p>
							)}
						</div>
					)}
				</div>

				<Link
					to="/admin/profile"
					className="hover:opacity-50 ease-in-out duration-300"
				>
					{isLoading || isError ? (
						<img
							src="https://via.placeholder.com/150"
							alt="Placeholder"
							className="rounded-full w-12 h-12 shadow-md"
						/>
					) : (
						<img
							src={`http://127.0.0.1:8000/${user[0].image}`}
							alt={`${user[0].name}'s profile`}
							className="rounded-full w-12 h-12 shadow-md"
						/>
					)}
				</Link>
			</div>
		</nav>
	)
}

export default Navbar
