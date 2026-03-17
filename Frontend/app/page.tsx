import { SitesGrid } from "@/components/sites-grid-enhanced";

export default function Home() {
  return (
    <div className="container-wrapper flex flex-1 flex-col pb-12">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <SitesGrid />
      </div>
    </div>
  );
}
