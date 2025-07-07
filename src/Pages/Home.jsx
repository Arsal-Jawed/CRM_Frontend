import { Login } from "../Components";
import { FiActivity, FiBarChart2, FiPieChart, FiDollarSign } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-white clip-diagonal">
          <FiActivity className="absolute top-1/5 left-1/4 text-clr1 text-4xl opacity-20" />
          <FiBarChart2 className="absolute top-3/4 left-1/3 text-clr1 text-5xl opacity-15" />
        </div>
        <div className="absolute inset-0 bg-grd1 clip-diagonal-reverse">
          <FiPieChart className="absolute bottom-1/4 right-1/4 text-white text-6xl opacity-20" />
          <FiDollarSign className="absolute top-1/3 right-1/5 text-white text-5xl opacity-15" />
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-10 right-20 w-3 h-3 rounded-full bg-white opacity-30"></div>
        <div className="absolute top-32 right-40 w-2 h-2 rounded-full bg-white opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/5 w-3 h-3 rounded-full bg-white opacity-30"></div>
        
        <div className="absolute top-20 left-32 w-3 h-3 rounded-full bg-clr1 opacity-30"></div>
        <div className="absolute bottom-28 left-40 w-2 h-2 rounded-full bg-clr1 opacity-30"></div>
        <div className="absolute top-1/4 left-1/5 w-3 h-3 rounded-full bg-clr1 opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Login />
      </div>

      <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }
        .clip-diagonal-reverse {
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
};

export default Home;