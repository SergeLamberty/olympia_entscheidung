import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InfoGaps from "./components/InfoGaps";
import PoliticalPositions from "./components/PoliticalPositions";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="info-gaps">
        <InfoGaps />
      </section>
      <section id="political-positions">
        <PoliticalPositions />
      </section>
      <Footer />
    </div>
  );
}

export default App;
