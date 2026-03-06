import { TbXboxXFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import Hyperspeed from "../components/animations/Hyperspeed";

function Notfound() {
  return (
    <div className="relative w-full h-[110vh] overflow-hidden">
      {/* Hyperspeed background */}
      <div className="absolute inset-0 -z-10">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
              rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
              sticks: 0xc5e8eb,
            },
          }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        <TbXboxXFilled className="text-6xl mb-6 text-red-500 animate-pulse" />

        <h1 className="text-7xl font-bold tracking-widest mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>

        <p className="max-w-md text-gray-300 mb-8">
          Sorry, the page you were searching for either moved, changed, or never
          existed in the first place.
          <br />
          <span className="text-gray-400">
            Since you're already here... enjoy the hyperspace ride 😉
          </span>
        </p>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 hover:bg-gray-200 transition"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
}

export default Notfound;
