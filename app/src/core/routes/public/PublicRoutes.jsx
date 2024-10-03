import Home from "../../../pages/user/Home"
import Cart from "../../../pages/user/Cart"
import ViewCategory from "../../../pages/user/instruments/ViewCategory"
import ViewProduct from "../../../pages/user/instruments/ViewProduct"
import ProductDetail from "../../../pages/user/instruments/ProductDetail"
import Checkout from "../../../pages/user/Checkout"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import ThankYou from "../../../components/user/ThankYou"
import Order from "../../../pages/user//order/Order"
import Profile from "../../../pages/user/Profile"
import SearchResults from "../../../pages/user/SearchResults"
import ProductReview from "../../../pages/user/order/ProductReview"
import Contact from "../../../pages/user/Contact"
import ProtectedPublicRoute from "./ProtectedPublicRoute"

const stripePublicKey = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(stripePublicKey)

export const PublicRoutes = [
	{
		path: "/",
		element: <Home />,
	},

	{
		path: "instruments",
		element: <ViewCategory />,
		children: [
			{
				path: ":slug",
				element: <ViewProduct />,
			},
			{
				path: ":category_slug/:product_slug",
				element: <ProductDetail />,
			},
		],
	},
	{
		path: "product/review/:slug",
		element: <ProductReview />,
	},
	{
		path: "contact",
		element: <Contact />,
	},
	{
		path: "searchresults",
		element: <SearchResults />,
	},
	{
		path: "thank-you",
		element: <ThankYou />,
	},
	{
		element: <ProtectedPublicRoute />,
		children: [
			{
				path: "cart",
				element: <Cart />,
			},
			{
				path: "checkout",
				element: (
					<Elements stripe={stripePromise}>
						<Checkout />,
					</Elements>
				),
			},
			{
				path: "order",
				element: <Order />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
		],
	},
]
