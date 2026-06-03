/**
 * FeaturesSection — 服務特色三大亮點
 * 設計：暖白背景 + 三欄卡片 + 暖橘圖示
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, Zap, Handshake } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "雙向精準媒合",
    desc: "我們不僅為企業尋覓不可或缺的良才，更為人才找到能發光發熱的舞台。深度理解雙方需求，讓每一次媒合都恰到好處。",
  },
  {
    icon: Zap,
    title: "彈性敏捷應變",
    desc: "貼近您的招募節奏，客製化調整服務時序，為您及時補齊團隊的關鍵戰力。快速回應，靈活配合企業的每一個招募時機。",
  },
  {
    icon: Handshake,
    title: "攜手長期共好",
    desc: "不只是招募，我們期盼成為企業長期發展的策略夥伴，攜手成長、共創卓越價值。您的成功，就是我們最大的成就。",
  },
];

export default function FeaturesSection() {
  const ref = useScrollAnimation();

  return (
    <section
      id="features"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "oklch(0.96 0.01 250)" }}
    >
      <div className="container" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-14">
          <p
            className="fade-up stagger-1 font-lato text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.62 0.15 45)" }}
          >
            Why Bravo
          </p>
          <h2
            className="fade-up stagger-2 font-serif-tc font-bold text-3xl lg:text-4xl"
            style={{ color: "oklch(0.28 0.08 250)" }}
          >
            為什麼選擇築夢人
          </h2>
          <div
            className="fade-up stagger-3 mx-auto mt-4 w-16 h-1 rounded-full"
            style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
          />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`fade-up stagger-${i + 1} group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              style={{ border: "1px solid oklch(0.92 0.01 250)" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:opacity-90"
                style={{ backgroundColor: "oklch(0.95 0.04 45)" }}
              >
                <f.icon
                  size={26}
                  style={{ color: "oklch(0.62 0.15 45)" }}
                  strokeWidth={1.8}
                />
              </div>
              <h3
                className="font-serif-tc font-bold text-xl mb-3"
                style={{ color: "oklch(0.28 0.08 250)" }}
              >
                {f.title}
              </h3>
              <p
                className="font-sans-tc text-sm leading-relaxed"
                style={{ color: "oklch(0.42 0.02 250)" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
