import { Header, Hero, Stats } from "src/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Stats />
      </main>
    </div>
  );
}