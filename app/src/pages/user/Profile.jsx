import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { userProfile } from "../../core/services/auth"
import LoadingComponent from "../../components/common/LoadingComponent"
import ErrorFetching from "../../components/common/ErrorFetching"

function Profile() {
	const {
		data: user,
		isLoading,
		isError,
	} = useQuery({
		queryFn: userProfile,
		queryKey: ["userProfile"],
	})

	useEffect(() => {
		document.title = "Profile"
	}, [])

	if (isLoading) {
		return <LoadingComponent />
	}
	if (isError) {
		return <ErrorFetching />
	}

	return (
		<div className="container mx-auto p-4">
			<h4 className="flex justify-between items-center text-xl font-semibold">
				User Profile
			</h4>
			<div className="flex flex-col items-center">
				<img
					src={`http://127.0.0.1:8000/${user[0].image}`}
					alt={`${user[0].name}'s profile`}
					className="rounded-full w-40 h-40 mb-4 shadow-lg"
				/>
				<h1 className="text-3xl font-bold mb-4">{user[0].name}</h1>
				<p className="text-gray-600 mb-4">{user[0].email}</p>
			</div>
		</div>
	)
}

export default Profile
