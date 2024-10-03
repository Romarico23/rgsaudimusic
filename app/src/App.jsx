import { RouterProvider } from "react-router-dom"
import { router } from "./core/routes/router"
import "./core/services/config"

function App() {
	return (
		<>
			<div className="font-outfit">
				<RouterProvider router={router} />
			</div>
		</>
	)
}

export default App
