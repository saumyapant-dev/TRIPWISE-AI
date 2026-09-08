import HeroBanner from "./HeroBanner";
import HeroImage from "./HeroImage";
import WhyChooseUs from "./WhyChooseUs";

const Section1 = () => {
  return (
    <section className="bg-[#f1f3f9] px-6 pt-32 pb-5">
      <HeroBanner />

      <div className="mt-16 flex justify-center">
        <HeroImage />
      </div>

      <div className="mt-16">
        <WhyChooseUs />
      </div>
    </section>
  );
};

export default Section1;