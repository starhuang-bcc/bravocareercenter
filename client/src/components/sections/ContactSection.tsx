/**
 * ContactSection — 聯絡表單
 * 設計：淺色辦公室背景 + 白色表單卡片 + 動態 placeholder
 * 功能：下拉選單切換時，訊息框 placeholder 動態改變
 */
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Send, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CONTACT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663726608645/KmSn4imp7E3CjLNAtUxPWq/contact-bg-4YtG742zfRZUz29dduaPLP.webp";

const categories = [
  { value: "1", label: "1. 求才企業" },
  { value: "2", label: "2. 合作詢問" },
  { value: "3", label: "3. 測驗結果應用與生涯諮詢" },
  { value: "4", label: "4. 申訴反應" },
  { value: "5", label: "5. 其他事項" },
];

const placeholders: Record<string, string> = {
  "": "請輸入您的寶貴訊息",
  "1": "請簡述貴公司名稱、預計招募之職缺名稱與需求人數，我們將盡快為您安排專業顧問...",
  "2": "請簡述您希望合作的項目（如：校園講座、招募專案等）與聯絡人資訊...",
  "3": "請輸入您的寶貴訊息",
  "4": "請輸入您的寶貴訊息",
  "5": "請輸入您的寶貴訊息",
};

export default function ContactSection() {
  const ref = useScrollAnimation();
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitMutation = trpc.contact.submit.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitMutation.mutateAsync({
        category,
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("訊息發送失敗，請稍後重試。");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CONTACT_BG})` }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(253,250,246,0.92)" }}
      />

      <div className="container relative z-10" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="fade-up stagger-1 font-lato text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.62 0.15 45)" }}
          >
            Contact Us
          </p>
          <h2
            className="fade-up stagger-2 font-serif-tc font-bold text-3xl lg:text-4xl"
            style={{ color: "oklch(0.28 0.08 250)" }}
          >
            與築夢人同行
          </h2>
          <p
            className="fade-up stagger-3 font-sans-tc text-sm lg:text-base mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.42 0.02 250)" }}
          >
            喜歡與人討論生涯是我們的初心，協助企業找人才是我們的專業。
            若您有任何招募需求或合作提案，歡迎透過表單與我們交流。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="fade-up stagger-2 lg:col-span-2 flex flex-col gap-6">
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "oklch(0.28 0.08 250)",
                color: "white",
              }}
            >
              <h3 className="font-serif-tc font-bold text-xl mb-5">聯絡資訊</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  >
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-sans-tc text-xs text-white/60 mb-0.5">電話</p>
                    <p className="font-lato text-sm font-semibold">02-77415193</p>
                    <p className="font-sans-tc text-xs text-white/60 mt-0.5">
                      辦公時間 10:00–17:00
                      <br />
                      諮詢時間 10:00–22:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  >
                    <Mail size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-sans-tc text-xs text-white/60 mb-0.5">Email</p>
                    <p className="font-lato text-sm font-semibold break-all">
                      info@bravocareercenter.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                  >
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-sans-tc text-xs text-white/60 mb-0.5">公司資訊</p>
                    <p className="font-sans-tc text-sm">築夢人生涯諮詢服務有限公司</p>
                    <p className="font-sans-tc text-xs text-white/60 mt-0.5">
                      統一編號：52355734
                      <br />
                      北市就服 No.283
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Consultation Links */}
            <div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "white",
                border: "1px solid oklch(0.90 0.02 250)",
              }}
            >
              <h4
                className="font-serif-tc font-bold text-base mb-4"
                style={{ color: "oklch(0.28 0.08 250)" }}
              >
                生涯諮詢服務
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://forms.gle/YTYE3Lu5bnJncteGA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans-tc text-sm px-4 py-2.5 rounded-lg text-center font-medium transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: "oklch(0.62 0.15 45)",
                    color: "white",
                  }}
                >
                  預約生涯諮詢
                </a>
                <a
                  href="https://bravocareercenter.github.io/BCCSurvey/#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans-tc text-sm px-4 py-2.5 rounded-lg text-center font-medium transition-all duration-200 hover:bg-slate-50"
                  style={{
                    color: "oklch(0.28 0.08 250)",
                    border: "1.5px solid oklch(0.90 0.02 250)",
                  }}
                >
                  免費生涯測驗
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className="fade-up stagger-3 lg:col-span-3 bg-white rounded-2xl p-6 lg:p-8 shadow-sm"
            style={{ border: "1px solid oklch(0.90 0.02 250)" }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "oklch(0.95 0.04 45)" }}
                >
                  <Send size={28} style={{ color: "oklch(0.62 0.15 45)" }} />
                </div>
                <h3
                  className="font-serif-tc font-bold text-xl mb-2"
                  style={{ color: "oklch(0.28 0.08 250)" }}
                >
                  訊息已送出！
                </h3>
                <p
                  className="font-sans-tc text-sm"
                  style={{ color: "oklch(0.52 0.02 250)" }}
                >
                  感謝您的聯繫，我們將盡快回覆您。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Category */}
                <div>
                  <label
                    className="font-sans-tc text-xs font-semibold block mb-1.5"
                    style={{ color: "oklch(0.35 0.03 250)" }}
                  >
                    諮詢類別
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      border: "1.5px solid oklch(0.88 0.02 250)",
                      color: category ? "oklch(0.28 0.08 250)" : "oklch(0.65 0.02 250)",
                      backgroundColor: "oklch(0.99 0.005 80)",
                    }}
                  >
                    <option value="">請選擇諮詢類別</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="font-sans-tc text-xs font-semibold block mb-1.5"
                      style={{ color: "oklch(0.35 0.03 250)" }}
                    >
                      姓氏 <span style={{ color: "oklch(0.62 0.15 45)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="王"
                      required
                      className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200"
                      style={{
                        border: "1.5px solid oklch(0.88 0.02 250)",
                        backgroundColor: "oklch(0.99 0.005 80)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="font-sans-tc text-xs font-semibold block mb-1.5"
                      style={{ color: "oklch(0.35 0.03 250)" }}
                    >
                      名字 <span style={{ color: "oklch(0.62 0.15 45)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="小明"
                      required
                      className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200"
                      style={{
                        border: "1.5px solid oklch(0.88 0.02 250)",
                        backgroundColor: "oklch(0.99 0.005 80)",
                      }}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      className="font-sans-tc text-xs font-semibold block mb-1.5"
                      style={{ color: "oklch(0.35 0.03 250)" }}
                    >
                      E-mail <span style={{ color: "oklch(0.62 0.15 45)" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200"
                      style={{
                        border: "1.5px solid oklch(0.88 0.02 250)",
                        backgroundColor: "oklch(0.99 0.005 80)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="font-sans-tc text-xs font-semibold block mb-1.5"
                      style={{ color: "oklch(0.35 0.03 250)" }}
                    >
                      聯絡電話
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0912-345-678"
                      className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200"
                      style={{
                        border: "1.5px solid oklch(0.88 0.02 250)",
                        backgroundColor: "oklch(0.99 0.005 80)",
                      }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    className="font-sans-tc text-xs font-semibold block mb-1.5"
                    style={{ color: "oklch(0.35 0.03 250)" }}
                  >
                    聯絡主旨
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="請輸入聯絡主旨"
                    className="w-full font-sans-tc text-sm px-4 py-2.5 rounded-xl outline-none transition-all duration-200"
                    style={{
                      border: "1.5px solid oklch(0.88 0.02 250)",
                      backgroundColor: "oklch(0.99 0.005 80)",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    className="font-sans-tc text-xs font-semibold block mb-1.5"
                    style={{ color: "oklch(0.35 0.03 250)" }}
                  >
                    訊息內容 <span style={{ color: "oklch(0.62 0.15 45)" }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={placeholders[category]}
                    required
                    rows={4}
                    className="w-full font-sans-tc text-sm px-4 py-3 rounded-xl outline-none transition-all duration-200 resize-none"
                    style={{
                      border: "1.5px solid oklch(0.88 0.02 250)",
                      backgroundColor: "oklch(0.99 0.005 80)",
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-sans-tc font-semibold text-sm py-3 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "oklch(0.28 0.08 250)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      發送中...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      送出訊息
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
