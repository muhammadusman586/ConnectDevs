/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [local, setLocal] = useState(value || "");
  const timerRef = useRef(null);

  useEffect(() => {
    setLocal(value || "");
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 300);
  };

  const handleClear = () => {
    setLocal("");
    onChange("");
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-accent text-sm pointer-events-none">
        $
      </span>
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-7 pr-9 py-2.5 bg-surface border border-border rounded-lg font-mono text-sm text-body placeholder:text-muted/30 focus:border-accent/40 accent-focus-ring transition-all duration-200 outline-none"
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-accent transition-colors font-mono text-sm"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
