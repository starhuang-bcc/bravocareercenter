/**
 * Footer — 頁尾
 * 設計：靛藍深色背景 + 三欄式資訊架構
 * 包含：Logo、人才服務、生涯諮詢、公司資訊、法規連結、管理員登入
 */
import { useState } from "react";
import { Phone, Mail, ExternalLink, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import PrivacyModal from "./PrivacyModal";

const talentServiceLinks = [
  {
    label: "隱私權政策",
    href: null, // Opens modal
    modal: true,
  },
  {
    label: "求職防騙",
    href: "https://bola.gov.taipei/News_Content.aspx?n=9c30ecd2c9d31116&s=a520830439ce2567",
  },
  {
    label: "防治就業歧視",
    href: "https://eeweb.mol.gov.tw/front/421",
  },
  {
    label: "雇主違法公告",
    href: "https://bola.gov.taipei/News.aspx?n=7C26DE8810A680AC&sms=EBEC4546C77557A3",
  },
  {
    label: "簽訂職業介紹契約應注意事項",
    href: "https://job.taiwanjobs.gov.tw/internet/index/docDetail.aspx?uk=2896&docid=37136",
  },
  {
    label: "職場性騷擾防治",
    href: "https://bola.gov.taipei/cp.aspx?n=DB41D62E8764742F",
  },
];

const careerLinks = [
  {
    label: "預約生涯諮詢",
    href: "https://forms.gle/YTYE3Lu5bnJncteGA",
  },
  {
    label: "免費生涯測驗",
    href: "https://bravocareercenter.github.io/BCCSurvey/#/",
  },
];

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleAdminClick = () => {
    navigate("/admin/contacts");
  };

  return (
    <>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <footer
        className="pt-14 pb-8"
        style={{ backgroundColor: "oklch(0.18 0.06 250)" }}
      >
        <div className="container">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Column 1: Logo + About */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <img
                  src="/manus-storage/bravo-logo_76062bf7.webp"
                  alt="Bravo Career Center Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <p
                    className="font-serif-tc font-bold text-lg text-white leading-tight"
                  >
                    策夢人
                  </p>
                  <p
                    className="font-lato tracking-widest mt-0.5"
                    style={{ color: "oklch(0.75 0.12 45)", fontSize: "0.65rem" }}
                  >
                    BRAVO CAREER CENTER
                  </p>
                </div>
              </div>
              <p
                className="font-sans-tc text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                bravo career center 是擁有就服機構證照的人才服務公司（北市就服 No.283），
                喜歡與人討論生涯、職涯是我們的初心。協助企業找人才是我們的專業。
                賦能適才適所，構築生涯適應是我們的願景。
              </p>
            </div>

            {/* Column 2: 人才服務 */}
            <div>
              <h4
                className="font-serif-tc font-bold text-sm text-white mb-4"
              >
                人才服務
              </h4>
              <ul className="flex flex-col gap-2">
                {talentServiceLinks.map((link) =>
                  link.modal ? (
                    <li key={link.label}>
                      <button
                        onClick={() => setPrivacyOpen(true)}
                        className="font-sans-tc text-xs transition-colors duration-200 hover:text-white text-left"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {link.label}
                      </button>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a
                        href={link.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans-tc text-xs flex items-center gap-1 transition-colors duration-200 hover:text-white"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {link.label}
                        <ExternalLink size={10} className="flex-shrink-0 opacity-60" />
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 3: 生涯諮詢服務 */}
            <div>
              <h4
                className="font-serif-tc font-bold text-sm text-white mb-4"
              >
                生涯諮詢服務
              </h4>
              <ul className="flex flex-col gap-2">
                {careerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans-tc text-xs flex items-center gap-1 transition-colors duration-200 hover:text-white"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {link.label}
                      <ExternalLink size={10} className="flex-shrink-0 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: 公司資訊 */}
            <div>
              <h4
                className="font-serif-tc font-bold text-sm text-white mb-4"
              >
                公司資訊
              </h4>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-sans-tc text-xs text-white">
                    築夢人生涯諮詢服務有限公司
                  </p>
                  <p
                    className="font-lato text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Bravo Career Center
                  </p>
                </div>

                <a
                  href="tel:02-77415193"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <Phone size={13} />
                  <span className="font-lato text-xs">02-77415193</span>
                </a>

                <a
                  href="mailto:info@bravocareercenter.com"
                  className="flex items-center gap-2 transition-colors hover:text-white break-all"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <Mail size={13} className="flex-shrink-0" />
                  <span className="font-lato text-xs">info@bravocareercenter.com</span>
                </a>

                <div
                  className="font-sans-tc text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <p>辦公時間 10:00–17:00</p>
                  <p>諮詢時間 10:00–22:00</p>
                  <p className="mt-1">統一編號：52355734</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="font-sans-tc text-xs"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              © 2026 築夢人生涯諮詢服務有限公司 All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Admin Login Link */}
              {user?.role === "admin" ? (
                <button
                  onClick={handleAdminClick}
                  className="font-sans-tc text-xs flex items-center gap-1 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  title="進入後台管理"
                >
                  <Lock size={12} />
                  <span>後台</span>
                </button>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Redirect to login if not authenticated
                    window.location.href = "/?login=true";
                  }}
                  className="font-sans-tc text-xs flex items-center gap-1 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  title="管理員登入"
                >
                  <Lock size={12} />
                  <span>管理員登入</span>
                </a>
              )}
              <button
                onClick={() => setPrivacyOpen(true)}
                className="font-sans-tc text-xs transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                隱私權政策
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
