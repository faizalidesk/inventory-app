import { useState, useRef, useEffect } from "react";
import { usePlatform, PLATFORMS } from "../context/PlatformContext";
import { FaChevronDown, FaLayerGroup } from "react-icons/fa";

export default function PlatformSelector() {
  const { activePlatform, setPlatform } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="platform-selector-wrap" ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="platform-selector-trigger"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "10px",
          background: "var(--platform-badge-bg, rgba(99, 102, 241, 0.15))",
          border: `1px solid ${activePlatform.color}40`,
          color: activePlatform.color,
          fontWeight: "600",
          fontSize: "13px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        title={`Active Platform: ${activePlatform.name}`}
      >
        <span style={{ fontSize: "14px" }}>{activePlatform.logoSymbol}</span>
        <span>{activePlatform.name}</span>
        <FaChevronDown style={{ fontSize: "10px", opacity: 0.7, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {isOpen && (
        <div
          className="platform-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "220px",
            background: "var(--card, #131B2E)",
            border: "1px solid var(--border, rgba(255,255,255,0.1))",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div style={{ padding: "4px 8px", fontSize: "11px", fontWeight: "700", color: "var(--muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Select Platform ID
          </div>

          {Object.values(PLATFORMS).map((p) => {
            const isSelected = p.id === activePlatform.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPlatform(p.id);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: isSelected ? p.badgeBg : "transparent",
                  border: isSelected ? `1px solid ${p.color}50` : "1px solid transparent",
                  color: isSelected ? p.color : "var(--text, #E5E7EB)",
                  textAlign: "left",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "15px" }}>{p.logoSymbol}</span>
                  <div>
                    <div style={{ fontWeight: isSelected ? "700" : "500" }}>{p.name}</div>
                    <div style={{ fontSize: "10px", opacity: 0.7 }}>{p.code} • {p.id}</div>
                  </div>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
