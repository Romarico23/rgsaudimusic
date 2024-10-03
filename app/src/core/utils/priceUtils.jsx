/**
 * Format a numeric value with commas and ensure it has two decimal places.
 * @param {string} value - The value to format.
 */
// utils/formatPrice.js
export const numberFormat = (value) => {
	return Number(value).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

/**
 * Remove commas and ensure only one decimal point is preserved.
 * @param {string} value - The value to clean.
 * @returns {string} - The cleaned value.
 */
export const removeCommas = (value) => {
	// Remove commas
	let cleanedValue = value.replace(/,/g, "")

	// Ensure only one decimal point
	const parts = cleanedValue.split(".")
	if (parts.length > 2) {
		// If there are multiple dots, join the parts and keep only the first dot
		cleanedValue = parts[0] + "." + parts.slice(1).join("")
	}

	return cleanedValue
}
