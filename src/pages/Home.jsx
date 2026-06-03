import Navbar from "../components/Navbar";
import Section1 from "../components/Section1/Section1";
import Section2 from "../components/Section2/Section2";
import Section3 from "../components/Section3/Section3";
import Footer from "../components/Footer";
function Home() {
  return (
    <div>
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
      <Footer />
    </div>
  );
}

export default Home;