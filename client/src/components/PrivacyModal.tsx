/**
 * PrivacyModal — 隱私權政策彈窗
 * 設計：白色卡片 + 靛藍標題 + 滾動內容
 */
import { X } from "lucide-react";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b rounded-t-2xl"
          style={{
            borderColor: "oklch(0.90 0.01 250)",
            backgroundColor: "oklch(0.28 0.08 250)",
          }}
        >
          <h2 className="font-serif-tc font-bold text-lg text-white">隱私權政策</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <p
            className="font-sans-tc text-xs mb-4"
            style={{ color: "oklch(0.52 0.02 250)" }}
          >
            更新日：2026 年 05 月
          </p>

          <p
            className="font-sans-tc text-sm leading-relaxed mb-5"
            style={{ color: "oklch(0.35 0.03 250)" }}
          >
            親愛的求職者/客戶，您的個人資料及隱私權益，築夢人生涯諮詢服務有限公司（以下簡稱「築夢」）絕對尊重及保護。
            為了幫助您瞭解我們如何蒐集、處理、利用及保護您的個人資料，請您詳閱下列隱私權保護政策內容：
          </p>

          {[
            {
              title: "蒐集之資訊",
              content: `築夢會透過工作申請、電話與面對面招募，可能會蒐集下列種類的個人資訊：
• 聯絡資訊（例如姓名、通訊地、電子郵件信箱與電話號碼）
• 就業與求學歷史
• 語言能力及其他工作相關技能
• 性別
• 推薦人提供之資訊
• 與您工作履歷有關的其他資訊`,
            },
            {
              title: "如何使用所蒐集之資訊",
              content:
                "築夢對於您的個人資料，將依蒐集時所闡述之特定目的及相關法令規定之範圍內使用。除非取得您的同意或依其他法令特別規定，築夢絕不會將您的個人資料揭露予第三人，或使用於蒐集目的以外之其他用途。",
            },
            {
              title: "個人資訊保護",
              content:
                "網站主機均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，加以保護您的個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。",
            },
            {
              title: "Cookie 之運用",
              content:
                "基於網站內部管理之需要及提供最佳個人化服務，網站將在您的瀏覽器中寫入 cookies 並讀取記錄瀏覽者的 IP 位址、上網時間，以及在各項資訊查閱之次數，進行網站流量和網路行為調查之總量分析。若您不願接受 cookie 的寫入，您可將使用中之瀏覽器設定為拒絕 cookie 的寫入，但也因此會使網站某些功能無法正常執行。",
            },
            {
              title: "個人資料之查詢、閱覽及刪除",
              content:
                "除法令另有規定外，您可以向本公司：（1）查詢或請求閱覽您的個人資料；（2）請求製給您個人資料之複製本；（3）請求補充或更正您的個人資料；（4）請求停止蒐集、利用或處理您的個人資料；或（5）請求刪除您的個人資料。您可以利用本公司客服專線（02-77415193）或線上表單提出上述申請。",
            },
            {
              title: "隱私權政策之修正及諮詢",
              content:
                "為確實保障您的隱私權，在法律所允許的範圍內，我們保留隨時修正本政策的權利，我們最近一次更新本政策的時間是 2026 年 05 月 22 日。若您對本《隱私權政策》有任何疑問或意見，請填線上表單或寫信至：info@bravocareercenter.com",
            },
          ].map((section) => (
            <div key={section.title} className="mb-5">
              <h3
                className="font-serif-tc font-bold text-base mb-2"
                style={{ color: "oklch(0.28 0.08 250)" }}
              >
                {section.title}
              </h3>
              <p
                className="font-sans-tc text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "oklch(0.42 0.02 250)" }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: "oklch(0.90 0.01 250)" }}>
          <button
            onClick={onClose}
            className="w-full font-sans-tc font-semibold text-sm py-2.5 rounded-xl text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "oklch(0.28 0.08 250)" }}
          >
            我已閱讀並了解
          </button>
        </div>
      </div>
    </div>
  );
}
