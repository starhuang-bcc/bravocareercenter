/**
 * ProcessSection — 五步驟服務流程
 * 設計：靛藍背景 + 橫向時間軸 + 數字大字排版
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageSquare, Database, Calendar, UserCheck, Shield } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "需求訪談",
    subtitle: "現場 / 線上，深度對焦",
    desc: "深入了解企業文化、職缺需求與理想人才輪廓，確保雙方目標一致。",
  },
  {
    num: "02",
    icon: Database,
    title: "人才搜尋",
    subtitle: "盤點 + 資料庫精準配對",
    desc: "結合主動搜尋與人才資料庫，精準篩選符合條件的優質候選人。",
  },
  {
    num: "03",
    icon: Calendar,
    title: "面試安排",
    subtitle: "高效安排企業面試",
    desc: "協助雙方溝通協調，安排面試時程，並提供面試前後的專業諮詢。",
  },
  {
    num: "04",
    icon: UserCheck,
    title: "聘雇協助",
    subtitle: "協助順利完成入職",
    desc: "協助薪資談判、offer 溝通，確保人才順利完成入職流程。",
  },
  {
    num: "05",
    icon: Shield,
    title: "保證服務",
    subtitle: "後續追蹤與保障",
    desc: "提供入職後追蹤服務，確保人才穩定融入，並提供相應的保固保障。",
  },
];

export default function ProcessSection() {
  const ref = useScrollAnimation();

  return (
    <section
      id="process"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: "oklch(0.28 0.08 250)" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3"
        style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 translate-y-1/3 -translate-x-1/4"
        style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
      />

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-14">
          <p
            className="fade-up stagger-1 font-lato text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.75 0.12 45)" }}
          >
            Our Process
          </p>
          <h2
            className="fade-up stagger-2 font-serif-tc font-bold text-3xl lg:text-4xl text-white"
          >
            五步驟招募流程
          </h2>
          <p
            className="fade-up stagger-3 font-sans-tc text-sm lg:text-base mt-4 max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            從需求訪談到後續追蹤，每一步都有專業顧問全程陪伴，
            確保招募過程順暢高效。
          </p>
        </div>

        {/* Steps — Desktop: horizontal timeline, Mobile: vertical */}
        <div className="hidden lg:flex items-start gap-0 relative">
          {/* Connecting line */}
          <div
            className="absolute top-10 left-0 right-0 h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", zIndex: 0 }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`fade-up stagger-${i + 1} flex-1 flex flex-col items-center text-center px-4 relative z-10`}
            >
              {/* Circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg"
                style={{
                  backgroundColor: i === 0 ? "oklch(0.62 0.15 45)" : "rgba(255,255,255,0.12)",
                  border: "2px solid",
                  borderColor: i === 0 ? "oklch(0.62 0.15 45)" : "rgba(255,255,255,0.25)",
                }}
              >
                <step.icon
                  size={28}
                  style={{ color: i === 0 ? "white" : "rgba(255,255,255,0.8)" }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Number */}
              <span
                className="font-lato font-bold text-xs tracking-widest mb-1"
                style={{ color: "oklch(0.75 0.12 45)" }}
              >
                {step.num}
              </span>

              {/* Title */}
              <h4
                className="font-serif-tc font-bold text-lg text-white mb-1"
              >
                {step.title}
              </h4>

              {/* Subtitle */}
              <p
                className="font-sans-tc text-xs mb-2"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {step.subtitle}
              </p>

              {/* Desc */}
              <p
                className="font-sans-tc text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden flex flex-col gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`fade-up stagger-${i + 1} flex gap-5 items-start`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: i === 0 ? "oklch(0.62 0.15 45)" : "rgba(255,255,255,0.12)",
                  border: "2px solid",
                  borderColor: i === 0 ? "oklch(0.62 0.15 45)" : "rgba(255,255,255,0.25)",
                }}
              >
                <step.icon
                  size={22}
                  style={{ color: i === 0 ? "white" : "rgba(255,255,255,0.8)" }}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <span
                  className="font-lato font-bold text-xs tracking-widest"
                  style={{ color: "oklch(0.75 0.12 45)" }}
                >
                  {step.num}
                </span>
                <h4 className="font-serif-tc font-bold text-lg text-white mt-0.5">
                  {step.title}
                </h4>
                <p
                  className="font-sans-tc text-xs mb-1"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {step.subtitle}
                </p>
                <p
                  className="font-sans-tc text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
