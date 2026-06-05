/**
 * AboutSection — 品牌故事 / 我們的歷史
 * 設計：左圖右文 + 暖橘裝飾線 + 十年里程碑數字
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/service-3-hr-communicative-male-Gwy2Wg5kTX2kp5zQrEmzE9.webp";

const milestones = [
  { num: "10+", label: "年深耕經驗" },
  { num: "100+", label: "諮詢晤談小時" },
  { num: "10000+", label: "Linkedin人才庫" },
];

export default function AboutSection() {
  const ref = useScrollAnimation();

  return (
    <section
      id="about"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "oklch(0.99 0.005 80)" }}
    >
      <div className="container">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          ref={ref}
        >
          {/* Image */}
          <div className="fade-up stagger-1 relative">
            <div
              className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl"
              style={{ backgroundColor: "oklch(0.95 0.04 250)", zIndex: 0 }}
            />
            <img
              src={ABOUT_IMG}
              alt="築夢人生涯諮詢品牌故事"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
              style={{ aspectRatio: "4/3" }}
            />
            {/* Floating badge */}
            <div
              className="absolute -top-5 -left-5 z-20 px-5 py-3 rounded-xl shadow-lg"
              style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
            >
              <p className="font-lato font-bold text-2xl text-white leading-none">10+</p>
              <p className="font-sans-tc text-xs text-white/90 mt-0.5">年深耕人才服務</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p
              className="fade-up stagger-1 font-lato text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "oklch(0.62 0.15 45)" }}
            >
              Our Story
            </p>
            <h2
              className="fade-up stagger-2 font-serif-tc font-bold text-3xl lg:text-4xl mb-2"
              style={{ color: "oklch(0.28 0.08 250)" }}
            >
              十年淬鍊，
            </h2>
            <h2
              className="fade-up stagger-2 font-serif-tc font-bold text-3xl lg:text-4xl mb-6"
              style={{ color: "oklch(0.62 0.15 45)" }}
            >
              初心不變
            </h2>

            <div
              className="fade-up stagger-3 w-12 h-1 rounded-full mb-6"
              style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
            />

            <p
              className="fade-up stagger-3 font-sans-tc text-sm lg:text-base leading-loose mb-4"
              style={{ color: "oklch(0.42 0.02 250)" }}
            >
              轉眼間，築夢人的旅程已邁入近 10 個年頭，每一步都走得辛苦卻扎實。
              我們從「生涯諮詢服務」起家，透過設計晤談工具與心理測驗，陪伴無數人探索自我。
            </p>
            <p
              className="fade-up stagger-4 font-sans-tc text-sm lg:text-base leading-loose mb-4"
              style={{ color: "oklch(0.42 0.02 250)" }}
            >
              這份對「人」的關懷，促使我們跨足人才媒合仲介領域。因為多元化的經營轉型，
              我們更深刻體會求職者在生涯選擇中的迷惘與目標追尋，期許自己成為連結企業與人才的最佳橋樑。
            </p>
            <p
              className="fade-up stagger-5 font-sans-tc text-sm lg:text-base leading-loose mb-8"
              style={{ color: "oklch(0.42 0.02 250)" }}
            >
              如今，「人才媒合」已是我們的服務重心。我們將關注青年職涯發展的熱情，
              傾注於每一次的人才招募服務中。期待與企業及人才攜手合作，
              成為彼此事業與職涯發展的長期夥伴。
            </p>

            {/* Milestones */}
            <div className="fade-up stagger-5 grid grid-cols-3 gap-4">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className="fade-up stagger-5 text-center py-4 rounded-xl"
                  style={{
                    backgroundColor: "oklch(0.96 0.01 250)",
                    border: "1px solid oklch(0.90 0.02 250)",
                  }}
                >
                  <p
                    className="font-lato font-bold text-2xl lg:text-3xl"
                    style={{ color: "oklch(0.28 0.08 250)" }}
                  >
                    {m.num}
                  </p>
                  <p
                    className="font-sans-tc text-xs mt-1"
                    style={{ color: "oklch(0.52 0.02 250)" }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
