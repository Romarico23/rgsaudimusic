import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import {
	getMonthlyVisitCount,
	getVisitCount,
	viewAllProducts,
	viewOrderItems,
} from "../../core/services/api"
import LoadingComponent from "../../components/common/LoadingComponent"
import ErrorFetching from "../../components/common/ErrorFetching"
import ReactApexChart from "react-apexcharts"
import { FiTruck, FiCheckCircle } from "react-icons/fi"
import { FaMedal, FaShippingFast } from "react-icons/fa"
import { numberFormat } from "../../core/utils/priceUtils"

function Dashboard() {
	const {
		data: orderItems,
		isLoading: orderItemsIsLoading,
		isError: orderItemsIsError,
	} = useQuery({
		queryFn: viewOrderItems,
		queryKey: ["viewOrderItems"],
	})

	const {
		data: products,
		isLoading: productsIsLoading,
		isError: productsIsError,
	} = useQuery({
		queryFn: viewAllProducts,
		queryKey: ["viewAllProducts"],
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const { data: totalVisit } = useQuery({
		queryFn: getVisitCount,
		queryKey: ["getVisitCount"],
	})

	const {
		data: monthlyVisit,
		isLoading: visitIsLoading,
		isError: visitIsError,
	} = useQuery({
		queryFn: getMonthlyVisitCount,
		queryKey: ["getMonthlyVisitCount"],
	})

	const totalGrandPrice = orderItems
		? orderItems.reduce((grandTotal, order) => {
				if (!order.order_items) return grandTotal
				const orderTotal = order.order_items.reduce(
					(total, item) => total + (item.quantity || 0) * (item.price || 0),
					0
				)
				return grandTotal + orderTotal
		  }, 0)
		: 0

	const monthlySales = orderItems
		? orderItems.reduce((acc, order) => {
				const orderMonth = new Date(order.created_at).toLocaleString("en-US", {
					month: "short",
					year: "numeric",
				})
				const orderTotal = order.order_items.reduce(
					(total, item) => total + (item.quantity || 0) * (item.price || 0),
					0
				)

				if (!acc[orderMonth]) acc[orderMonth] = { totalSales: 0, orderCount: 0 }
				acc[orderMonth].totalSales += orderTotal
				acc[orderMonth].orderCount += 1
				return acc
		  }, {})
		: {}

	const monthlySalesData = Object.keys(monthlySales).map((month) => ({
		month,
		total: monthlySales[month].totalSales,
		orderCount: monthlySales[month].orderCount,
	}))

	// Prepare product stock data for the bar chart
	const productStockData = products
		? products.map((product) => ({
				name: product.slug,
				stock: product.quantity || 0,
		  }))
		: []

	const chartData = {
		chart: {
			type: "line",
		},
		series: [
			{
				name: "Total Sales",
				data: monthlySalesData.map((data) => data.total),
			},
			{
				name: "Order Count",
				data: monthlySalesData.map((data) => data.orderCount),
			},
		],
		xaxis: {
			categories: monthlySalesData.map((data) => data.month),
		},
		yaxis: {
			labels: {
				formatter: (value) => numberFormat(value),
			},
		},
		tooltip: {
			y: {
				formatter: (value) => numberFormat(value),
			},
		},
	}

	const stockChartData = {
		chart: {
			type: "bar",
		},
		series: [
			{
				name: "Stock Count",
				data: productStockData.map((product) => product.stock),
			},
		],
		xaxis: {
			categories: productStockData.map((product) => product.name),
		},
		yaxis: {
			labels: {
				formatter: (value) => numberFormat(value),
			},
		},
	}

	// Prepare data for total visits graph
	const visitChartData = {
		chart: {
			type: "line",
		},
		series: [
			{
				name: "Total Visits",
				data: monthlyVisit?.total_visits.map((visit) => visit.count) || [],
			},
		],
		xaxis: {
			categories: monthlyVisit?.total_visits.map((visit) => visit.month) || [],
		},
		yaxis: {
			labels: {
				formatter: (value) => numberFormat(value),
			},
		},
	}

	useEffect(() => {
		document.title = "Dashboard"
	}, [])

	if (orderItemsIsLoading || productsIsLoading || visitIsLoading) {
		return <LoadingComponent />
	}

	if (orderItemsIsError || productsIsError || visitIsError) {
		return <ErrorFetching />
	}

	return (
		<div className="">
			<h1 className="font-bold text-2xl pl-6 pt-6">ADMIN DASHBOARD</h1>
			<div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
				{/* Total Sales Breakdown */}
				<div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-lg">
					<h2 className="text-lg font-semibold mb-2">Total Sales</h2>
					<p className="text-2xl font-bold">{numberFormat(totalGrandPrice)}</p>
					<h3 className="text-md font-semibold mt-4">
						Monthly Sales Breakdown
					</h3>
					<ul className="space-y-2 mt-2">
						{monthlySalesData.map((data) => (
							<li key={data.month} className="flex justify-between">
								<span>{data.month}</span>
								<span>{numberFormat(data.total)}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Total Visit Breakdown */}
				<div className="p-6 bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg rounded-lg">
					<h2 className="text-lg font-semibold mb-2">Total Visit</h2>
					<p className="text-2xl font-bold">{totalVisit?.total_visits}</p>
					<h3 className="text-md font-semibold mt-4">
						Monthly Visit Breakdown
					</h3>
					<ul className="space-y-2 mt-2">
						{monthlyVisit.total_visits.map((data) => (
							<li key={data.month} className="flex justify-between">
								<span>{data.month}</span>
								<span>{data.count}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Order Count Breakdown */}
				<div className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg rounded-lg">
					<h2 className="text-lg font-semibold mb-2">Total Orders</h2>
					<p className="text-2xl font-bold">
						{monthlySalesData.reduce(
							(total, data) => total + data.orderCount,
							0
						)}{" "}
						Orders
					</p>
					<h3 className="text-md font-semibold mt-4">
						Monthly Order Breakdown
					</h3>
					<ul className="space-y-2 mt-2">
						{monthlySalesData.map((data) => (
							<li key={data.month} className="flex justify-between">
								<span>{data.month}</span>
								<span>{data.orderCount} Orders</span>
							</li>
						))}
					</ul>
				</div>

				{/* Sales and Orders Graph */}
				<div className="p-4 bg-white shadow-md rounded-md col-span-3">
					<h2 className="text-lg font-semibold mb-2">Sales & Orders Graph</h2>
					<ReactApexChart
						options={chartData}
						series={chartData.series}
						type="line"
						height={350}
					/>
				</div>

				{/* Product Stock Graph */}
				<div className="p-4 bg-white shadow-md rounded-md col-span-3">
					<h2 className="text-lg font-semibold mb-2">Product Stock Graph</h2>
					<ReactApexChart
						options={stockChartData}
						series={stockChartData.series}
						type="bar"
						height={350}
					/>
				</div>

				{/* Total Visits Graph */}
				<div className="p-4 bg-white shadow-md rounded-md col-span-3">
					<h2 className="text-lg font-semibold mb-2">Total Visits Graph</h2>
					<ReactApexChart
						options={visitChartData}
						series={visitChartData.series}
						type="line"
						height={350}
					/>
				</div>

				{/* Top Products */}
				<div className="p-6 bg-gray-50 shadow-md rounded-lg h-64 overflow-y-auto">
					<h2 className="text-lg font-semibold mb-4 flex items-center">
						<FaMedal className="mr-2" /> Top Products
					</h2>
					<div className="space-y-2">
						{products &&
							products.map((item) => {
								return (
									item.popular === 1 && (
										<div key={item.id} className="flex items-center">
											<img
												src={`http://127.0.0.1:8000/${
													JSON.parse(item.images)[0]
												}`}
												alt={item.name}
												className="w-10 h-10 object-cover mr-2"
											/>
											<span className="line-clamp-2 hover:line-clamp-3">
												{item.name}
											</span>
										</div>
									)
								)
							})}
					</div>
				</div>

				{/* To Ship Orders */}
				<div className="p-6 bg-gray-50 shadow-md rounded-lg h-64 overflow-y-auto relative">
					<h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<FaShippingFast className="mr-2" /> To Ship Orders
						</div>
					</h2>
					<div className="space-y-2">
						{orderItems &&
							orderItems
								.filter((item) => item.status === 0)
								.map((item) => (
									<div key={item.id}>
										{item.order_items.map((orderItem) => {
											const images =
												orderItem.product?.images &&
												orderItem.product.images !== null
													? JSON.parse(orderItem.product.images)[0]
													: null
											return (
												<div key={orderItem.id} className="flex items-center">
													<img
														src={
															images === null
																? "https://via.placeholder.com/150"
																: `http://127.0.0.1:8000/${images}`
														}
														alt={
															images === null
																? "Unavailable"
																: orderItem.product.name
														}
														className="w-10 h-10 object-cover mr-2"
													/>
													{images === null ? (
														<span className="text-center px-2 py-1 bg-red-500 text-white rounded">
															Product Unavailable
														</span>
													) : (
														<span className="line-clamp-2 hover:line-clamp-4">
															{orderItem.product.name}
														</span>
													)}
												</div>
											)
										})}
									</div>
								))}
					</div>
				</div>

				{/* Shipped Orders */}
				<div className="p-6 bg-gray-50 shadow-md rounded-lg h-64 overflow-y-auto relative">
					<h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<FiTruck className="mr-2" /> Shipped Orders
						</div>
					</h2>
					<div className="space-y-2">
						{orderItems &&
							orderItems
								.filter((item) => item.status === 1)
								.map((item) => (
									<div key={item.id}>
										{item.order_items.map((orderItem) => {
											const images =
												orderItem.product?.images &&
												orderItem.product.images !== null
													? JSON.parse(orderItem.product.images)[0]
													: null

											return (
												<div key={orderItem.id} className="flex items-center">
													<img
														src={
															images === null
																? "https://via.placeholder.com/150"
																: `http://127.0.0.1:8000/${images}`
														}
														alt={
															images === null
																? "Unavailable"
																: orderItem.product.name
														}
														className="w-10 h-10 object-cover mr-2"
													/>
													{images === null ? (
														<span className="text-center px-2 py-1 bg-red-500 text-white rounded">
															Product Unavailable
														</span>
													) : (
														<span className="line-clamp-2 hover:line-clamp-4">
															{orderItem.product.name}
														</span>
													)}
												</div>
											)
										})}
									</div>
								))}
					</div>
				</div>

				{/* Received Orders */}
				<div className="p-6 bg-gray-50 shadow-md rounded-lg h-64 overflow-y-auto relative">
					<h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<FiCheckCircle className="mr-2" /> Received Orders
						</div>
					</h2>
					<div className="space-y-2">
						{orderItems &&
							orderItems
								.filter((item) => item.status === 2)
								.map((item) => (
									<div key={item.id}>
										{item.order_items.map((orderItem) => {
											const images =
												orderItem.product?.images &&
												orderItem.product.images !== null
													? JSON.parse(orderItem.product.images)[0]
													: null
											return (
												<div key={orderItem.id} className="flex items-center">
													<img
														src={
															images === null
																? "https://via.placeholder.com/150"
																: `http://127.0.0.1:8000/${images}`
														}
														alt={
															images === null
																? "Unavailable"
																: orderItem.product.name
														}
														className="w-10 h-10 object-cover mr-2"
													/>
													{images === null ? (
														<span className="text-center px-2 py-1 bg-red-500 text-white rounded">
															Product Unavailable
														</span>
													) : (
														<span className="line-clamp-2 hover:line-clamp-4">
															{orderItem.product.name}
														</span>
													)}
												</div>
											)
										})}
									</div>
								))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
