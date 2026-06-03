import Temp from "./Temp";
import Img from "./Img";
import QndA from "./QndA";

const Section1 = () => {
  return (
    <section className="bg-[#f1f3f9] px-6 pt-32 pb-5">
      <Temp />

      <div className="mt-16 flex justify-center">
        <Img />
      </div>

      <div className="mt-16">
        <QndA />
      </div>
    </section>
  );
};

export default Section1;