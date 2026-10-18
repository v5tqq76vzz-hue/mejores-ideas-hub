import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/tarjetas")({
  head: () => serviceHead("tarjetas"),
  component: () => <ServicePage slug="tarjetas" />,
});
