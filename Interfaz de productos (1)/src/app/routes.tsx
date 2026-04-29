import { createBrowserRouter } from "react-router";
import ProductsLayout from "./pages/ProductsLayout";
import ProductsCatalog from "./pages/ProductsCatalog";
import ProductDetail from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ProductsLayout,
    children: [
      { index: true, Component: ProductsCatalog },
      { path: "productos", Component: ProductsCatalog },
      { path: "productos/:id", Component: ProductDetail },
    ],
  },
]);
