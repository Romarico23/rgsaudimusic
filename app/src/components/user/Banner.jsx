import React, { useState, useEffect } from "react"
import Boveda_Website from "/src/assets/banner/Boveda_Website.jpg"
import Crafter_Guitars_Website from "/src/assets/banner/Crafter_Guitars_Website.jpg"
import GP_Looper from "/src/assets/banner/GP_Looper.jpg"
import rgs_logo_profile from "/src/assets/banner/rgs_logo_profile.jpg"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const Banner = () => {
	const images = [
		Crafter_Guitars_Website,
		Boveda_Website,
		GP_Looper,
		rgs_logo_profile,
	]

	const [currentIndex, setCurrentIndex] = useState(0)

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		)
	}

	const handlePrev = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		)
	}

	const handleIndicatorClick = (index) => {
		setCurrentIndex(index)
	}

	useEffect(() => {
		const timer = setInterval(() => {
			handleNext()
		}, 5000)

		return () => clearInterval(timer)
	}, [currentIndex])

	return (
		<div className="relative w-full max-w-full mx-auto bg-black">
			<div className="relative w- h-[500px]">
				<img
					src={images[currentIndex]}
					alt={`Banner ${currentIndex + 1}`}
					className="object-contain  w-full h-full"
				/>

				<IoIosArrowBack
					onClick={handlePrev}
					className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 text-white px-2 rounded-full w-12 h-12 hover:cursor-pointer"
				/>

				<IoIosArrowForward
					onClick={handleNext}
					className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 bg-opacity-50 text-white px-2 rounded-full w-12 h-12 hover:cursor-pointer"
				/>
			</div>

			<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
				{images.map((_, index) => (
					<div
						key={index}
						onClick={() => handleIndicatorClick(index)}
						className={`w-3 h-3 rounded-full cursor-pointer ${
							index === currentIndex ? "bg-blue-500" : "bg-gray-300"
						}`}
					></div>
				))}
			</div>
		</div>
	)
}

export default Banner
