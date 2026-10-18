import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/enlaces")({
  head: () => serviceHead("enlaces"),
  component: () => <ServicePage slug="enlaces" />,
});
