export const consultationBookingLink = "https://forms.gle/YTYE3Lu5bnJncteGA";

export const consultationOptions = [
  {
    id: "career",
    title: "職涯諮詢",
    description: "釐清轉職、海外發展、履歷面試、Offer 選擇、談薪與長期職涯方向。",
  },
  {
    id: "bravo",
    title: "築夢諮詢",
    description: "以敘事取向晤談，整理生命主題、實踐自我認同並強化生活適應力。",
  },
] as const;

export const consultationDetails = {
  career: {
    eyebrow: "CAREER CONSULTATION",
    title: "職涯諮詢",
    paragraphs: [
      "在職涯發展的不同階段，許多人都可能面臨各種選擇與疑問：是否該轉換跑道？想去海外打工渡假？如何準備履歷、面試？如何選擇 Offer？想加薪，怎麼談？當資訊過多、選項變多時，反而更容易陷入猶豫與不確定。",
      "本晤談透過對話與分析，協助釐清工作目標與可能的選項。我們一起整理目前資源，評估不同的機會與風險，並思考長期的職涯發展。這個過程不是替你做決定；當方向逐漸清晰，接下來的行動與計畫會更有信心。",
    ],
  },
  bravo: {
    eyebrow: "BRAVO CONSULTATION",
    title: "築夢諮詢",
    paragraphs: [
      "當生活與工作交織出新的課題，築夢諮詢提供一段穩定、專注的對話時間，陪你整理生命經驗、內在感受與正在形成的方向。",
      "透過敘事取向的晤談，我們從你的故事出發，重新看見自身資源與選擇，讓自我認同逐步落地，也為接下來的生活行動找到更適合自己的節奏。",
    ],
  },
} as const;

export const consultationInfo = [
  { label: "諮詢時間", value: "60 分鐘" },
  { label: "諮詢費用", value: "線上 $800／次；現場 $1,000／次" },
  { label: "付款方式", value: "諮詢後付款" },
  { label: "諮詢地點", value: "Google Meet／現場" },
] as const;

export type ConsultationOptionId = (typeof consultationOptions)[number]["id"];

export function getConsultationDetails(id: ConsultationOptionId) {
  return consultationDetails[id];
}

export function isConsultationOptionId(value: string): value is ConsultationOptionId {
  return consultationOptions.some((option) => option.id === value);
}

export const consultationLogoUrl = "/manus-storage/bravo-logo-icon_d5e91661.webp";
export const consultationPageTitle = "預約生涯諮詢 | Bravo Career Center";
export const consultationPageDescription =
  "選擇適合的職涯諮詢或築夢諮詢服務，填寫資料後，Bravo Career Center 將依您提供的聯絡方式安排諮詢。";

export const consultationA11y = {
  logoAlt: "Bravo Career Center 去背 Logo",
  openBooking: "開啟諮詢後付款連結（新分頁）",
  optionList: "諮詢服務選擇",
} as const;

export const consultationContentVersion = "2026-08-19";

export default {
  consultationBookingLink,
  consultationOptions,
  consultationDetails,
  consultationInfo,
  consultationLogoUrl,
  consultationPageTitle,
  consultationPageDescription,
};
