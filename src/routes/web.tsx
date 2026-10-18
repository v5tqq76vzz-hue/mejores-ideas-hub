import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/web")({
  head: () => serviceHead("web"),
  component: () => <ServicePage slug="web" />,
});
