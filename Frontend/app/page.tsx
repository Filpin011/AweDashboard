import { SitesGrid } from "@/components/sites-grid";

export default function Home() {
  return (
    <div className="container-wrapper flex flex-1 flex-col pb-8">
      <div className="container flex flex-1 flex-col">
        <SitesGrid />
      </div>
    </div>
  );
}
