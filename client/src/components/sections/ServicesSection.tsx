/**
 * ServicesSection — 核心服務（專業獵才 + 人才外包）
 * 設計：左右交替非對稱排版 + 職缺網格 + 跑馬燈
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, Users, CheckCircle, Clock, FileText, RotateCcw } from "lucide-react";

const HEADHUNTING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/services-headhunting-team-j5QRQcnxpptxgywCXRhX7v.webp";
const OUTSOURCING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/talent-outsourcing-service-AS78aiUn8yQEiRxdbRRofb.webp";
const MALE_COACHING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/service-3-hr-communicative-male-Gwy2Wg5kTX2kp5zQrEmzE9.webp";

const jobPositions = [
  "軟韌體開發 RD",
  "硬體研發 RD",
  "類比/數位 IC 設計 RD",
  "封裝 RD",
  "資料工程/分析師",
  "測試品保 RD",
  "製程/製程整合 RD",
  "Business Development Manager",
  "Product / Project Manager",
];

const outsourcingFeatures = [
  { icon: FileText, text: "從招募到離職的一站式全程服務" },
  { icon: Clock, text: "出勤打卡系統整合管理" },
  { icon: RotateCcw, text: "派駐轉正的彈性機制" },
  { icon: CheckCircle, text: "人資行政作業全程協助" },
];

export default function ServicesSection() {
  const ref1 = useScrollAnimation();
  const ref2 = useScrollAnimation();

  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="font-lato text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.62 0.15 45)" }}
          >
            Our Services
          </p>
          <h2
            className="font-serif-tc font-bold text-3xl lg:text-4xl"
            style={{ color: "oklch(0.28 0.08 250)" }}
          >
            核心服務
          </h2>
          <div
            className="mx-auto mt-4 w-16 h-1 rounded-full"
            style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
          />
        </div>

        {/* Service 1: 專業獵才 */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-28"
          ref={ref1}
        >
          {/* Text */}
          <div>
            <div
              className="fade-up stagger-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                backgroundColor: "oklch(0.95 0.04 250)",
                color: "oklch(0.28 0.08 250)",
              }}
            >
              <Search size={14} />
              專業獵才服務
            </div>
            <h3
              className="fade-up stagger-2 font-serif-tc font-bold text-2xl lg:text-3xl mb-4"
              style={{ color: "oklch(0.28 0.08 250)" }}
            >
              精準媒合，
              <br />
              <span style={{ color: "oklch(0.62 0.15 45)" }}>為您找到不可或缺的人才</span>
            </h3>
            <p
              className="fade-up stagger-3 font-sans-tc text-sm lg:text-base leading-relaxed mb-6"
              style={{ color: "oklch(0.42 0.02 250)" }}
            >
              跨足各式產業，精準洞察企業需求，為您及時媒合不可或缺的專業人才與中高階主管職缺。
              我們擁有豐富的人才資料庫，結合深度需求訪談，確保每一位推薦人選都能真正符合您的期待。
            </p>

            {/* Job Grid */}
            <div className="fade-up stagger-4">
              <p
                className="font-sans-tc text-xs font-semibold mb-3 tracking-wide"
                style={{ color: "oklch(0.52 0.02 250)" }}
              >
                常見招募職缺
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {jobPositions.slice(0, 9).map((job) => (
                  <span
                    key={job}
                    className="font-sans-tc text-xs px-3 py-1.5 rounded-lg text-center"
                    style={{
                      backgroundColor: "oklch(0.97 0.01 250)",
                      color: "oklch(0.28 0.08 250)",
                      border: "1px solid oklch(0.90 0.02 250)",
                    }}
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="fade-up stagger-2 relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
              style={{ backgroundColor: "oklch(0.95 0.04 45)", zIndex: 0 }}
            />
            <img
              src={HEADHUNTING_IMG}
              alt="专業獵才服務"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
              style={{ aspectRatio: "4/3", objectPosition: "center" }}
            />
          </div>
        </div>



        {/* Service 2: 人才外包 */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          ref={ref2}
        >
          {/* Image (left) */}
          <div className="fade-up stagger-1 relative order-2 lg:order-1">
            <div
              className="absolute -top-4 -right-4 w-full h-full rounded-2xl"
              style={{ backgroundColor: "oklch(0.95 0.04 45)", zIndex: 0 }}
            />
            <img
              src={OUTSOURCING_IMG}
              alt="人才外包服務"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
              style={{ aspectRatio: "16/9", objectPosition: "left center" }}
            />
          </div>

          {/* Text (right) */}
          <div className="order-1 lg:order-2">
            <div
              className="fade-up stagger-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                backgroundColor: "oklch(0.95 0.04 45)",
                color: "oklch(0.50 0.12 45)",
              }}
            >
              <Users size={14} />
              人才外包服務
            </div>
            <h3
              className="fade-up stagger-2 font-serif-tc font-bold text-2xl lg:text-3xl mb-4"
              style={{ color: "oklch(0.28 0.08 250)" }}
            >
              靈活活用人才，
              <br />
              <span style={{ color: "oklch(0.62 0.15 45)" }}>讓企業管理更省心</span>
            </h3>
            <p
              className="fade-up stagger-3 font-sans-tc text-sm lg:text-base leading-relaxed mb-6"
              style={{ color: "oklch(0.42 0.02 250)" }}
            >
              靈活活用人才，優化人資管理。我們提供從招募到離職的「一站式」全程服務，
              涵蓋出勤打卡系統管理，並搭配派駐轉正的彈性機制，讓企業管理更省心。
            </p>

            {/* Feature List */}
            <div className="fade-up stagger-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outsourcingFeatures.map((f) => (
                <div
                  key={f.text}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "oklch(0.97 0.01 250)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "oklch(0.95 0.04 45)" }}
                  >
                    <f.icon size={16} style={{ color: "oklch(0.62 0.15 45)" }} strokeWidth={1.8} />
                  </div>
                  <span
                    className="font-sans-tc text-sm leading-relaxed"
                    style={{ color: "oklch(0.35 0.03 250)" }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
