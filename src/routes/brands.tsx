import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brands")({
  component: BrandsLayout,
});

function BrandsLayout() {
  return <Outlet />;
}
