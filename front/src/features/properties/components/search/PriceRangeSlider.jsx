import { useState, useEffect } from 'react';

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 10000);
    const updatedValue = [newMin, localValue[1]];
    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 10000);
    const updatedValue = [localValue[0], newMax];
    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = 100 - ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="relative pt-6">
      {/* Track con fill */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-primary-500 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`
          }}
        />
      </div>

      {/* Input min */}
      <input
        type="range"
        min={min}
        max={max}
        step={10000}
        value={localValue[0]}
        onChange={handleMinChange}
        className="absolute w-full pointer-events-none appearance-none bg-transparent
                   [&::-webkit-slider-thumb]:pointer-events-auto
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-primary-600
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-moz-range-thumb]:pointer-events-auto
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-primary-600
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:shadow-lg"
        style={{ zIndex: localValue[0] > max - 100000 ? 5 : 3 }}
      />

      {/* Input max */}
      <input
        type="range"
        min={min}
        max={max}
        step={10000}
        value={localValue[1]}
        onChange={handleMaxChange}
        className="absolute w-full pointer-events-none appearance-none bg-transparent
                   [&::-webkit-slider-thumb]:pointer-events-auto
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-primary-600
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-moz-range-thumb]:pointer-events-auto
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-primary-600
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:shadow-lg"
        style={{ zIndex: 4 }}
      />
    </div>
  );
};

export default PriceRangeSlider;
