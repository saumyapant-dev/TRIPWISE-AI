import GeneratorHeader from "./GeneratorHeader";
import Form from "./Form";

const Tripgenerator = () => {
  return (
    <div className="bg-[#f2f4fb] min-h-screen w-full flex flex-col items-center justify-start gap-10 pt-10 pb-20">
      <GeneratorHeader />
      <Form />
    </div>
  );
};

export default Tripgenerator;
