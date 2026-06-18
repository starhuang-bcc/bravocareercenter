/**
 * FAQSection — 常見問題
 * 設計：手風琴式展開/收起
 * 功能：點選問題展開回答，支持多個同時展開
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "你們是獵頭公司嗎？",
    answer:
      "我們和獵頭公司在商業模式上有些相似，但服務範圍更廣。我們是依《就業服務法》向主管機關申請許可立案的私立就業服務機構，同時提供人力仲介與生涯諮詢兩項服務。\n\n對求職者來說，仲介國內工作這項服務完全免費，相關費用由委託企業支付；生涯諮詢服務為獨立收費項目，若您正在思考職涯方向、需要更深入的陪伴與引導，我們的生涯諮詢服務會是很好的起點。\n\n想進一步了解，歡迎填寫表單，我們會盡快與您聯繫。",
  },
  {
    id: "2",
    question: "企業委託找人才，費用怎麼計算？",
    answer:
      "我們採成功收費制，以錄取者年薪的一定比例計算服務費用，人選正式到職後才收費，未能成功媒合則不收取任何費用，讓貴公司的每一筆預算都花在刀口上。\n\n我們也刻意將費率訂得比市場行情更親切一些——因為我們相信，讓更多求職者被看見、被重視，才是這份工作最重要的初衷。\n\n具體費率依職缺性質有所不同，歡迎來電或來信，我們將安排專人為您詳細說明。",
  },
  {
    id: "3",
    question: "你們可以協助招募哪些職缺？",
    answer:
      "我們從軟體產業出發，多年來累積了豐富的人才招募實戰經驗。但我們從未停下腳步——持續參與各產業論壇、展覽，拓展資料庫，也深耕 LinkedIn 等專業社群，認識各行各業優秀的專業人士，逐步建立起涵蓋多元產業的人才資料庫。\n\n現在我們，對各類職缺的招募需求有所準備。無論是常見職位還是特殊需求，外商或中小企業，都歡迎與我們聊聊。",
  },
];

export default function FAQSection() {
  const ref = useScrollAnimation();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="max-w-3xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "oklch(0.28 0.08 250)" }}
          >
            常見問題
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{ color: "oklch(0.50 0.05 250)" }}
          >
            快速了解我們的服務模式與收費方式
          </p>
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:border-slate-300 transition-colors"
            >
              {/* 問題按鈕 */}
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <span
                  className="font-semibold text-base sm:text-lg"
                  style={{ color: "oklch(0.28 0.08 250)" }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    expandedIds.has(faq.id) ? "rotate-180" : ""
                  }`}
                  style={{ color: "oklch(0.28 0.08 250)" }}
                />
              </button>

              {/* 回答內容 */}
              {expandedIds.has(faq.id) && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 animate-in fade-in duration-300">
                  <p
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "oklch(0.50 0.05 250)" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
