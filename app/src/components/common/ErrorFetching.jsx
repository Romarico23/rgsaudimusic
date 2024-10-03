import React from "react"
import Swal from "sweetalert2"

function ErrorFetching() {
	Swal.fire("Error", "Error Fetching", "error")
	return (
		<div className="flex items-center justify-center">
			Error: No data available!
		</div>
	)
}

export default ErrorFetching
