import Lsection1 from "../components/Lsection1/Lsection1";
import Lsection2 from "../components/Lsection2/Lsection2";

function Login() {
  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      <Lsection1 />
      <Lsection2 />
    </div>
  );
}

export default Login;