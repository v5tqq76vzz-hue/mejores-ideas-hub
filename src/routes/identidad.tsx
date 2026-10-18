import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/identidad")({
  head: () => serviceHead("identidad"),
  component: () => <ServicePage slug="identidad" />,
});
