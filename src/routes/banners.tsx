import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead } from "@/components/site/ServicePage";

export const Route = createFileRoute("/banners")({
  head: () => serviceHead("banners"),
  component: () => <ServicePage slug="banners" />,
});
