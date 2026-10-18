import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/logo")({
  head: () => serviceHead("logo"),
  component: () => <ServicePage slug="logo" />,
});
