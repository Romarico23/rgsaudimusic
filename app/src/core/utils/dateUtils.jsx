export function formatDate(dateString) {
	const date = new Date(dateString)

	// Format the date using Intl.DateTimeFormat
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: true,
	}).format(date)

	return formattedDate
}
