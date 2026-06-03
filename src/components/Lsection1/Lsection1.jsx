import HeroText from "./HeroText";
import Features from "./Features";

const Lsection1 = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200')",
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 via-green-300/60 to-purple-500/70"></div>

      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 flex flex-col justify-center h-screen px-30 text-white">
        <HeroText />
        <Features />
      </div>

    </div>
  );
};

export default Lsection1;