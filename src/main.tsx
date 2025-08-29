import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.tsx";
import Index from "./routes/index.tsx";
import MyjCube from "./routes/myj-cube/index.tsx";
import RasenSphere from "./routes/rasen-sphere/index.tsx";
import ReactFlowPage from "./routes/react-flow/index.tsx";
import FlowTutorial from "./routes/flow-tutorial/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      { path: "/myj-cube", element: <MyjCube /> },
      { path: "/rasen-sphere", element: <RasenSphere /> },
      { path: "/react-flow", element: <ReactFlowPage /> },
      { path: "/flow-tutorial", element: <FlowTutorial /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
