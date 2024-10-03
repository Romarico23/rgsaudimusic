import React, { useEffect } from "react"
import Banner from "../../components/user/Banner"
import { viewAllProducts } from "../../core/services/api"
import { useQuery } from "@tanstack/react-query"
import LoadingComponent from "../../components/common/LoadingComponent"
import ErrorFetching from "../../components/common/ErrorFetching"
import { Link } from "react-router-dom"
import { numberFormat } from "../../core/utils/priceUtils"
import electric_guitars from "/src/assets/category/electric-guitars_250x.png"
import accessories from "/src/assets/category/accessories_250x.png"
import amplifiers from "/src/assets/category/amplifiers_250x.png"
import acoustic_guitars from "/src/assets/category/acoustic-guitars_250x.png"
import bass_guitars from "/src/assets/category/bass-guitars_250x.png"
import effects from "/src/assets/category/effects_250x.png"
import electronic_drums from "/src/assets/category/electronic_drums_250x.png"
import ukuleles from "/src/assets/category/ukuleles_250x.png"
import Footer from "../../components/user/layouts/Footer"

function Home() {
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

	useEffect(() => {
		document.title = "RG'S Audimusic"
	}, [])

	const categoryImages = [
		{ id: 1, category: "Electric Guitar", image: electric_guitars },
		{ id: 2, category: "Acoustic Guitar", image: acoustic_guitars },
		{ id: 3, category: "Bass Guitar", image: bass_guitars },
		{ id: 4, category: "Amplifier", image: amplifiers },
		{ id: 5, category: "Ukelele", image: ukuleles },
		{ id: 6, category: "Effects", image: effects },
		{ id: 7, category: "Accessories", image: accessories },
		{ id: 8, category: "Drums", image: electronic_drums },
	]

	const featuredVideos = [
		{
			url: "https://www.youtube.com/embed/-o4qwuvRp4c",
		},
		{
			url: "https://www.youtube.com/embed/qqF0Zcotk8I",
		},
		{
			url: "https://www.youtube.com/embed/lj4XaAWAUEw",
		},
		{
			url: "https://www.youtube.com/embed/DfG7gD_zYPU",
		},
	]

	if (productsIsLoading) {
		return <LoadingComponent />
	}

	if (productsIsError) {
		return <ErrorFetching />
	}

	return (
		<div>
			<Banner />
			<div className="p-10 ">
				<h1 className="text-xl lg:text-2xl font-semibold text-orange-500">
					NEW PRODUCTS
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
					{products.map((item) => {
						return (
							item.featured === 1 && (
								<div
									key={item.id}
									className="relative px-2 flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
								>
									<Link
										className="relative mx-auto mt-3 flex h-48 sm:h-60 overflow-hidden rounded-xl"
										to={`/instruments/${item.category.slug}/${item.slug}`}
									>
										<img
											className="h-full w-full object-cover"
											src={`http://127.0.0.1:8000/${
												JSON.parse(item.images)[0]
											}`}
											alt={item.name}
											loading="lazy"
										/>
									</Link>
									<div className="p-2">
										<Link
											to={`/instruments/${item.category.slug}/${item.slug}`}
										>
											<h3 className="font-semibold text-slate-900 truncate">
												{item.name}
											</h3>
										</Link>
										<div className="mt-2 mb-2 flex flex-col items-start">
											<span className="font-bold text-slate-900">
												₱ {numberFormat(item.selling_price)}
											</span>
											<span className="text-sm text-slate-900 line-through">
												₱ {numberFormat(item.original_price)}
											</span>
										</div>
									</div>
								</div>
							)
						)
					})}
				</div>
			</div>
			<div className="px-10 ">
				<h1 className="text-xl lg:text-2xl font-semibold text-orange-500">
					INSTRUMENTS
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
					{categoryImages.map((item) => {
						return (
							<div
								key={item.id}
								className="relative flex flex-col overflow-hidden rounded-lg"
							>
								<Link
									className="relative mx-auto mt-3 flex h-60 overflow-hidden rounded-xl"
									to={`/instruments/${item.category}`}
								>
									<img
										className="h-full w-full object-cover"
										src={item.image}
										alt="Category"
										loading="lazy"
									/>
								</Link>
							</div>
						)
					})}
				</div>
			</div>
			<div className="p-10 flex justify-center">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{featuredVideos.map((video, index) => (
						<div
							key={index}
							className="relative pb-[56.25%] h-0 overflow-hidden"
						>
							<iframe
								src={video.url}
								className="w-full h- sm:w-[450px] sm:h-[250px] md:w-[650px] md:h-[350px] lg:w-[450px] lg:h-[250px] 2xl:w-[650px] 2xl:h-[350px]"
							/>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Home
