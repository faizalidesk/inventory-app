import { usePlatform } from "../context/PlatformContext";
import { FaCode, FaLeaf, FaPalette, FaChartLine, FaShieldAlt, FaServer, FaBolt, FaGlobe } from "react-icons/fa";

export default function PlatformHeroVisual() {
  const { activePlatform } = usePlatform();

  if (activePlatform.id === "alpha") {
    // ⚡ ALPHA: CODE TERMINAL & DEV ENGINE MOCKUP
    return (
      <div className="hero-platform-visual alpha-visual" style={{ background: "rgba(11, 15, 25, 0.9)", border: "1px solid var(--platform-color)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 50px var(--platform-color-glow)" }}>
        <div style={{ background: "#111827", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--platform-color)" }}>
            ⚡ alpha-edge-server.ts [CONNECTED]
          </div>
          <div style={{ fontSize: "11px", color: "#9CA3AF", display: "flex", gap: "10px" }}>
            <span>REST API</span>
            <span style={{ color: "#10B981" }}>• 200 OK</span>
          </div>
        </div>

        <div style={{ padding: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", lineHeight: "1.7", color: "#E5E7EB" }}>
          <div style={{ color: "#6B7280" }}>// Platform Alpha: Edge Runtime Initialization</div>
          <div><span style={{ color: "#F472B6" }}>import</span> &#123; <span style={{ color: "#93C5FD" }}>createPlatformEngine</span> &#125; <span style={{ color: "#F472B6" }}>from</span> <span style={{ color: "#A7F3D0" }}>"@alpha/core"</span>;</div>
          <br />
          <div><span style={{ color: "#F472B6" }}>const</span> engine = <span style={{ color: "#F472B6" }}>await</span> <span style={{ color: "#93C5FD" }}>createPlatformEngine</span>(&#123;</div>
          <div style={{ paddingLeft: "16px" }}>tenantId: <span style={{ color: "#A7F3D0" }}>"{activePlatform.id}"</span>,</div>
          <div style={{ paddingLeft: "16px" }}>realtimeSync: <span style={{ color: "#F472B6" }}>true</span>,</div>
          <div style={{ paddingLeft: "16px" }}>latency: <span style={{ color: "#FCD34D" }}>"1.2ms"</span></div>
          <div>&#125;);</div>
          <br />
          <div style={{ background: "rgba(99, 102, 241, 0.15)", padding: "10px 14px", borderRadius: "8px", borderLeft: "3px solid var(--platform-color)", color: "#C7D2FE", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>▶ Executing database query...</span>
            <span style={{ background: "var(--platform-color)", color: "#FFF", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>READY</span>
          </div>
        </div>

        <div style={{ padding: "12px 20px", background: "rgba(17, 24, 39, 0.8)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "16px", fontSize: "11px", color: "#9CA3AF" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaBolt style={{ color: "#6366F1" }} /> Latency: 1.2ms</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaServer style={{ color: "#10B981" }} /> Nodes: 1,024</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaShieldAlt style={{ color: "#F59E0B" }} /> Security: Encrypted</span>
        </div>
      </div>
    );
  }

  if (activePlatform.id === "beta") {
    // 🌿 BETA: ECO INNOVATION & CARBON DASHBOARD MOCKUP
    return (
      <div className="hero-platform-visual beta-visual" style={{ background: "rgba(4, 29, 26, 0.95)", border: "1px solid var(--platform-color)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 50px var(--platform-color-glow)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.2)", display: "grid", placeItems: "center", color: "#10B981", fontSize: "18px" }}>
              <FaLeaf />
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#ECFDF5", fontSize: "14px" }}>Green Tech Audit</div>
              <div style={{ fontSize: "11px", color: "#6EE7B7" }}>100% Powered by Renewable Energy</div>
            </div>
          </div>
          <span style={{ background: "#10B981", color: "#064E3B", fontWeight: "800", fontSize: "11px", padding: "4px 10px", borderRadius: "99px" }}>
            GRADE A+
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "rgba(6, 78, 59, 0.3)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontSize: "11px", color: "#A7F3D0" }}>Carbon Offset Rate</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#34D399", margin: "4px 0" }}>84.2%</div>
            <div style={{ fontSize: "10px", color: "#6EE7B7" }}>↓ 1.4kg CO2 saved/user</div>
          </div>
          <div style={{ background: "rgba(6, 78, 59, 0.3)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontSize: "11px", color: "#A7F3D0" }}>Server PUE Rating</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#10B981", margin: "4px 0" }}>1.04</div>
            <div style={{ fontSize: "10px", color: "#6EE7B7" }}>Ultra Eco Efficiency</div>
          </div>
        </div>

        {/* Eco Lifecycle Meter Bar */}
        <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#A7F3D0", marginBottom: "6px" }}>
            <span>Green Energy Capacity</span>
            <span style={{ fontWeight: "700" }}>98.5%</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(16, 185, 129, 0.15)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: "98.5%", height: "100%", background: "linear-gradient(90deg, #10B981, #34D399)", borderRadius: "4px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (activePlatform.id === "gamma") {
    // ✨ GAMMA: CREATIVE MOTION & SHADER STUDIO MOCKUP
    return (
      <div className="hero-platform-visual gamma-visual" style={{ background: "rgba(19, 7, 34, 0.95)", border: "1px solid var(--platform-color)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 50px var(--platform-color-glow)", position: "relative", overflow: "hidden" }}>
        {/* Glow orb */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(147, 51, 234, 0.25)", display: "grid", placeItems: "center", color: "#C084FC", fontSize: "18px" }}>
              <FaPalette />
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#F3E8FF", fontSize: "14px" }}>GLSL Motion Canvas</div>
              <div style={{ fontSize: "11px", color: "#C084FC" }}>120 FPS Realtime Render</div>
            </div>
          </div>
          <span style={{ border: "1px solid #9333EA", color: "#E9D5FF", fontSize: "10px", padding: "3px 10px", borderRadius: "99px", fontWeight: "700" }}>
            STUDIO 3D
          </span>
        </div>

        {/* Art Card Showcase */}
        <div style={{ height: "140px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(224, 86, 253, 0.15) 100%)", border: "1px solid rgba(147, 51, 234, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", position: "relative" }}>
          <div style={{ fontSize: "28px", filter: "drop-shadow(0 0 10px rgba(147,51,234,0.8))" }}>✨ 🎨 🌀</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: "800", fontSize: "16px", color: "#F3E8FF", letterSpacing: "0.05em" }}>
            KINETIC MOTION ENGINE
          </div>
          <div style={{ fontSize: "11px", color: "#D8B4FE" }}>Liquid Mesh Shaders & Dynamic Typography</div>
        </div>
      </div>
    );
  }

  // 🔥 DELTA: ENTERPRISE ANALYTICS & HEATMAP SUITE MOCKUP
  return (
    <div className="hero-platform-visual delta-visual" style={{ background: "rgba(28, 18, 4, 0.95)", border: "1px solid var(--platform-color)", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 50px var(--platform-color-glow)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.25)", display: "grid", placeItems: "center", color: "#F59E0B", fontSize: "18px" }}>
            <FaChartLine />
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "#FEF3C7", fontSize: "14px" }}>Enterprise Heatmap Suite</div>
            <div style={{ fontSize: "11px", color: "#FBBF24" }}>Global Cluster Status: NOMINAL</div>
          </div>
        </div>
        <span style={{ background: "#F59E0B", color: "#451A03", fontWeight: "800", fontSize: "11px", padding: "4px 10px", borderRadius: "99px" }}>
          SLA 99.999%
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
        <div style={{ background: "rgba(69, 26, 3, 0.4)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#FDE68A" }}>DATA STREAM</div>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#F59E0B", marginTop: "2px" }}>4.8 PB</div>
        </div>
        <div style={{ background: "rgba(69, 26, 3, 0.4)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#FDE68A" }}>REGIONS</div>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#FBBF24", marginTop: "2px" }}>48 Nodes</div>
        </div>
        <div style={{ background: "rgba(69, 26, 3, 0.4)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#FDE68A" }}>THROUGHPUT</div>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#F59E0B", marginTop: "2px" }}>100k req/s</div>
        </div>
      </div>

      {/* Simulated Live Bar Graph */}
      <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 14px", borderRadius: "12px" }}>
        <div style={{ fontSize: "11px", color: "#FDE68A", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
          <span>Realtime Executive Analytics Stream</span>
          <span style={{ color: "#F59E0B" }}>Live 🔥</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "40px" }}>
          {[40, 65, 30, 85, 95, 55, 75, 90, 100, 70, 85, 95].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(0deg, #D97706, ${i % 2 === 0 ? "#F59E0B" : "#FBBF24"})`, borderRadius: "3px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
