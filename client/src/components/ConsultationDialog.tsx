import { useState } from "react";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { consultationBookingLink, consultationLogoUrl, consultationDetails, consultationOptions, type ConsultationOptionId } from "@shared/consultation";

const TIMES = [
  "平日白天 10:00–17:00",
  "平日晚上 18:00–21:00",
  "假日白天 10:00–17:00",
  "假日晚上 18:00–21:00",
] as const;

type ConsultationForm = {
  name: string;
  email: string;
  phone: string;
  serviceType: ConsultationOptionId;
  consultationMode: "online" | "in_person";
  preferredTimes: (typeof TIMES)[number][];
  message: string;
};

const initialForm: ConsultationForm = {
  name: "",
  email: "",
  phone: "",
  serviceType: "career",
  consultationMode: "online",
  preferredTimes: ["平日晚上 18:00–21:00"],
  message: "",
};

export function ConsultationDialog({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ConsultationForm>(initialForm);
  const selectedDetail = consultationDetails[form.serviceType];

  const submit = trpc.consultations.submit.useMutation({
    onSuccess: () => {
      toast.success("已送出預約申請，我們會盡快與您聯繫。");
      setForm(initialForm);
      setSubmitted(true);
    },
    onError: (error) => {
      toast.error(error.message || "目前無法送出預約，請稍後再試。");
    },
  });

  const updateForm = <K extends keyof ConsultationForm>(key: K, value: ConsultationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleTime = (time: (typeof TIMES)[number]) => {
    setForm((current) => {
      const checked = current.preferredTimes.includes(time);
      return {
        ...current,
        preferredTimes: checked
          ? current.preferredTimes.filter((item) => item !== time)
          : [...current.preferredTimes, time],
      };
    });
  };

  const closeDialog = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSubmitted(false);
      submit.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-testid="consultation-dialog-trigger"
          className={`${
            compact
              ? "text-left text-sm text-slate-300 hover:text-cyan-200"
              : "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          } ${className}`}
        >
          預約生涯諮詢
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#dbe4f0] bg-[#fbfcfe] p-5 sm:max-w-2xl sm:p-8">
        {submitted ? (
          <div className="space-y-5 py-8 text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-600" aria-hidden="true" />
            <DialogTitle className="font-serif-tc text-2xl text-[#172033]">預約申請已送出</DialogTitle>
            <DialogDescription className="text-base leading-7 text-[#606975]">
              我們將於 2 個工作天內依您留下的聯絡方式回覆安排，謝謝您。
            </DialogDescription>
            <Button className="w-full bg-[#e7772c] hover:bg-[#d76720]" onClick={() => closeDialog(false)}>
              完成
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <div className="mb-1 flex items-center gap-3">
                <img
                  src={consultationLogoUrl}
                  alt="Bravo Career Center 去背 Logo"
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <p className="font-sans-tc text-[0.68rem] font-semibold tracking-[0.2em] text-[#e7772c]">
                    BRAVO CAREER CENTER
                  </p>
                  <DialogTitle className="mt-1 font-serif-tc text-2xl text-[#172033]">預約生涯諮詢</DialogTitle>
                </div>
              </div>
              <DialogDescription className="text-left font-sans-tc text-base leading-relaxed text-[#5d6672]">
                先選擇適合的服務與方式，填寫資料後，Bravo Career Center 將依您提供的聯絡方式安排諮詢。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Service Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {consultationOptions.map((option) => {
                  const isSelected = form.serviceType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => updateForm("serviceType", option.id)}
                      className={`group relative rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185abc] ${
                        isSelected
                          ? "border-[#2563c7] bg-[#eef5ff] shadow-sm"
                          : "border-[#e1e5ea] bg-white hover:border-[#b8c8dc]"
                      }`}
                    >
                      <h4 className="font-serif-tc text-xl font-bold text-[#101a2c]">{option.title}</h4>
                      <p className="mt-2 font-sans-tc text-sm leading-relaxed text-[#66707d]">{option.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Service Detail Explanation */}
              <div className="rounded-2xl border border-[#e0e4e9] bg-white p-6 shadow-xs">
                <h4 className="font-serif-tc text-xl font-bold text-[#172033]">{selectedDetail.title}</h4>
                <div className="mt-4 space-y-4 font-sans-tc text-base leading-relaxed text-[#626b77]">
                  {selectedDetail.paragraphs.map((para: string) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Consultation Details Card */}
              <div className="rounded-2xl bg-[#f3f5f8] p-6 space-y-3 font-sans-tc text-base text-[#606975]">
                <p><strong className="text-[#172033]">諮詢時間：</strong>60 分鐘</p>
                <p><strong className="text-[#172033]">諮詢費用：</strong>線上 $800／次；現場 $1,000／次</p>
                <p><strong className="text-[#172033]">付款方式：</strong>諮詢後付款</p>
                <p><strong className="text-[#172033]">諮詢地點：</strong>{form.consultationMode === "online" ? "Google Meet" : "現場晤談室"}</p>
                <div className="pt-2">
                  <a
                    href={consultationBookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#b9cdea] bg-white px-4 py-2.5 font-sans-tc text-sm font-bold text-[#1f5db6] shadow-2xs transition-all hover:bg-[#f8fbff] hover:shadow-xs"
                  >
                    諮詢後付款連結
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Booking Form */}
              <form
                className="space-y-5 border-t border-[#e2e8f0] pt-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit.mutate({
                    ...form,
                    serviceType: form.serviceType === "career" ? "career" : "dream",
                    message: form.message || undefined,
                  });
                }}
              >
                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-[#172033]">選擇諮詢方式</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["online", "in_person"] as const).map((mode) => {
                      const selected = form.consultationMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => updateForm("consultationMode", mode)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185abc] ${
                            selected
                              ? "border-[#2563c7] bg-[#2563c7] text-white"
                              : "border-[#dbe2ea] bg-white text-[#4e5968] hover:border-[#b8c8dc]"
                          }`}
                        >
                          {mode === "online" ? "線上（Google Meet）" : "現場"}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-[#172033]">偏好諮詢時段</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TIMES.map((time) => {
                      const checked = form.preferredTimes.includes(time);
                      return (
                        <label
                          key={time}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                            checked ? "border-[#b8c8dc] bg-[#f7faff] text-[#1f5db6]" : "border-[#dbe2ea] bg-white text-[#5e6978]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleTime(time)}
                            className="size-4 accent-[#2563c7]"
                          />
                          <span>{time}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="consultation-name">姓名</Label>
                    <Input id="consultation-name" required value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultation-phone">電話</Label>
                    <Input id="consultation-phone" required value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation-email">Email</Label>
                  <Input id="consultation-email" required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation-message">想討論的主題（選填）</Label>
                  <Textarea id="consultation-message" value={form.message} onChange={(event) => updateForm("message", event.target.value)} />
                </div>

                <Button className="w-full bg-[#e7772c] text-white hover:bg-[#d76720]" type="submit" disabled={submit.isPending || form.preferredTimes.length === 0}>
                  {submit.isPending ? "送出中…" : "送出預約申請"}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ConsultationDialog;
