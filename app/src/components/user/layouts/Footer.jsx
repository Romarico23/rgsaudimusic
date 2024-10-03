import React from "react"
import rgs_logo_profile from "/src/assets/banner/rgs_logo_profile.jpg"
import { FaFacebook, FaGlobe } from "react-icons/fa"
import { Link } from "react-router-dom"

function Footer() {
	return (
		<div>
			<div className="bg-gray-700 text-white py-10 px-4">
				<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 px-5 md:px-0">
					<div>
						<h3 className="text-lg font-semibold text-yellow-500 mb-4">
							Get In Touch
						</h3>
						<ul className="space-y-2">
							<li>Mobile: +63905-884-6618</li>
							<li>Telephone: +632-8671-4382</li>
							<li>Email: romaricopetallo@gmail.com</li>
						</ul>
					</div>

					{/* <div className="flex flex-col items-center"> */}
					<div className="flex flex-col xl:items-center">
						<img
							src={rgs_logo_profile}
							alt="Company logo"
							className="mb-4 w-full max-w-[150px]"
						/>
						<p className="xl:text-center ">
							22B Road 9 Street, Brgy. Bagong Pagasa, Quezon City, Philippines
						</p>
						<div className="flex space-x-3 mt-4">
							{/* Replace with actual icons */}
							<Link to={"/"} className="text-blue-500">
								<FaGlobe size={20} />
							</Link>
							<Link
								to="https://www.facebook.com/rgsaudimusic"
								className="text-blue-600"
							>
								<FaFacebook size={20} />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Footer
