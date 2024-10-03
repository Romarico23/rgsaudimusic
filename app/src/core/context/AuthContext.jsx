import { createContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState(null)

	useEffect(() => {
		const token = Cookies.get("auth_token")
		if (token) {
			setIsAuthenticated(true)
			setUser({ name: Cookies.get("auth_name") })
		}
	}, [])

	const login = (data) => {
		Cookies.set("auth_token", data.token, { secure: true, sameSite: "Strict" })
		Cookies.set("auth_name", data.name)
		setIsAuthenticated(true)
		setUser({ name: data.name })
	}

	const logout = () => {
		Cookies.remove("auth_token")
		Cookies.remove("auth_name")
		setIsAuthenticated(false)
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext
