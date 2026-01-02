import { ViteReactSSG } from "vite-react-ssg";
import App from "./App";
import { routes } from "./routes";
import "./index.css";

export const createRoot = ViteReactSSG(
  {
    routes: [
      {
        path: "/",
        element: <App />,
        children: routes,
      },
    ],
    basename: import.meta.env.BASE_URL,
  }
);
