import { useState } from "react";

const DemoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-yellow-500 text-yellow-950 px-4 py-2 text-sm font-medium flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <span>
          <strong>Student Project — Not affiliated with Coinbase.</strong>{" "}
          This is a demo app built for educational purposes. Do not enter real
          personal or financial information.
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-yellow-900 hover:text-yellow-950 font-bold text-lg leading-none flex-shrink-0"
        aria-label="Dismiss banner"
      >
        ×
      </button>
    </div>
  );
};

export default DemoBanner;