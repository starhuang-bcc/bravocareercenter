/**
 * HeroSection — 首頁主視覺
 * 設計：全寬背景圖 + 左對齊文字 + 暖橘 CTA 按鈕
 * 圖片：暖色調辦公室面試場景
 */
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/hero-banner-jGWMXeAW27iYC6Tx4LsWWC.webp";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundPosition: "30% center" }}
      />
      {/* Overlay: left-side gradient for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(27,63,110,0.82) 0%, rgba(27,63,110,0.65) 45%, rgba(27,63,110,0.15) 75%, transparent 100%)",
        }}
      />


      {/* Content */}
      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-lato font-semibold tracking-widest uppercase mb-6 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              backgroundColor: "rgba(224,122,60,0.25)",
              color: "#FFD4A8",
              border: "1px solid rgba(224,122,60,0.5)",
              transitionDelay: "0ms",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
            />
            北市就服 No.283 · 專業人才服務公司
          </div>

          {/* Main Title */}
          <h1
            className={`font-serif-tc font-bold text-white leading-snug mb-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              transitionDelay: "120ms",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            懂企業的渴求，
            <br />
            聽見人才的期盼，
            <br />
            <span style={{ color: "#FFB87A" }}>讓對的人在這裡相遇。</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`font-sans-tc text-base lg:text-lg leading-relaxed mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              color: "rgba(255,255,255,0.85)",
              transitionDelay: "240ms",
              maxWidth: "520px",
            }}
          >
            築夢人生涯諮詢服務有限公司，以近十年的深厚經驗，
            為企業精準媒合專業、中高階人才，
            並陪伴每位求職者找到屬於自己的舞台。
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "360ms" }}
          >
            <button
              onClick={scrollToContact}
              className="font-sans-tc font-semibold px-8 py-3.5 rounded-full text-white text-sm lg:text-base transition-all duration-200 hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
            >
              立即諮詢企業需求
            </button>
            <button
              onClick={scrollToServices}
              className="font-sans-tc font-semibold px-8 py-3.5 rounded-full text-sm lg:text-base transition-all duration-200 hover:bg-white/20 active:scale-95"
              style={{
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.6)",
              }}
            >
              了解服務內容
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <span className="font-lato text-xs text-white/60 tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="text-white/60 animate-bounce" />
      </div>
    </section>
  );
}
