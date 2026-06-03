/**
 * Home — 築夢人生涯諮詢服務有限公司 一頁式官網
 * 設計：溫暖敘事設計 | 靛藍 + 暖橘 | Noto Serif TC
 *
 * 區塊順序：
 * 1. Navbar (固定頂部)
 * 2. HeroSection (主視覺)
 * 3. FeaturesSection (服務特色)
 * 4. ServicesSection (核心服務 + 跑馬燈)
 * 5. ProcessSection (五步驟流程)
 * 6. AboutSection (品牌故事)
 * 7. ContactSection (聯絡表單)
 * 8. Footer (頁尾)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.99 0.005 80)" }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
