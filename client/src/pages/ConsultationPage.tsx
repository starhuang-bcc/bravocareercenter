import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  consultationA11y,
  consultationBookingLink,
  consultationDetails,
  consultationInfo,
  consultationLogoUrl,
  consultationOptions,
  type ConsultationOptionId,
} from "@shared/consultation";

export default function ConsultationPage() {
  const [selectedId, setSelectedId] = useState<ConsultationOptionId>("career");
  const selected = consultationDetails[selectedId];

  return (
    <div className="min-h-screen bg-[#fbfcfe] text-[#172033]">
      <Navbar />
      <main className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 max-w-4xl">
            <h1 className="font-serif-tc text-[2.15rem] font-bold leading-tight tracking-tight text-[#101a2c] sm:text-5xl">
              預約生涯諮詢
            </h1>
            <p className="mt-3 max-w-4xl font-sans-tc text-xl leading-[1.65] text-[#5d6672] sm:text-2xl">
              先選擇適合的服務與方式，填寫資料後，Bravo Career Center 將依您提供的聯絡方式安排諮詢。
            </p>
          </header>

          <section aria-labelledby="service-options-title">
            <h2 id="service-options-title" className="sr-only">
              選擇適合你的諮詢
            </h2>
            <div className="grid gap-5 md:grid-cols-2" role="list" aria-label={consultationA11y.optionList}>
              {consultationOptions.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="listitem"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(option.id)}
                    className={`group relative min-h-[220px] rounded-[28px] border-2 px-7 py-8 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185abc] focus-visible:ring-offset-2 sm:px-8 sm:py-9 ${
                      isSelected
                        ? "border-[#2563c7] bg-[#eef5ff] shadow-[0_10px_24px_rgba(37,99,199,0.08)]"
                        : "border-[#e1e5ea] bg-white hover:border-[#b8c8dc]"
                    }`}
                  >
                    <img
                      src={consultationLogoUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute right-6 top-6 h-10 w-10 object-contain opacity-80 transition-transform duration-200 group-hover:scale-105 sm:right-7 sm:top-7"
                    />
                    <h3 className="pr-14 font-serif-tc text-[1.7rem] font-bold leading-tight text-[#101a2c] sm:text-3xl">
                      {option.title}
                    </h3>
                    <p className="mt-5 max-w-[32rem] font-sans-tc text-xl leading-[1.75] text-[#66707d] sm:text-[1.35rem]">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="mt-7 rounded-[28px] border border-[#e0e4e9] bg-white px-7 py-8 sm:px-9 sm:py-10"
            aria-live="polite"
          >
            <h2 className="font-serif-tc text-2xl font-bold leading-tight text-[#172033] sm:text-3xl">
              {selected.title}
            </h2>
            <div className="mt-7 space-y-6 font-sans-tc text-xl leading-[1.8] text-[#626b77] sm:text-[1.35rem]">
              {selected.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-7 rounded-[28px] bg-[#f3f5f8] px-7 py-8 sm:px-8 sm:py-9" aria-labelledby="consultation-details-title">
            <h2 id="consultation-details-title" className="sr-only">
              諮詢資訊
            </h2>
            <div className="space-y-2 font-sans-tc text-lg leading-[1.75] text-[#606975] sm:text-xl">
              {consultationInfo.map((item) => (
                <p key={item.label}>
                  <strong className="font-bold text-[#172033]">{item.label}：</strong>
                  {item.value}
                </p>
              ))}
            </div>
            <a
              href={consultationBookingLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={consultationA11y.openBooking}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#b9cdea] bg-white px-5 py-3 font-sans-tc text-lg font-bold text-[#1f5db6] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#f8fbff] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185abc] focus-visible:ring-offset-2"
            >
              諮詢後付款連結
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </section>

          <p className="mt-7 text-center font-sans-tc text-base leading-7 text-[#8993a2]">
            如有其他問題，歡迎透過首頁聯絡表單與我們交流。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
