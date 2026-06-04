import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface ContactSubmission {
  id: number;
  category: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: number;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    // 直接從資料庫查詢所有提交
    const fetchSubmissions = async () => {
      try {
        // 使用 trpc 查詢提交列表
        const result = await fetch("/api/trpc/contact.list?batch=1", {
          credentials: "include",
        });
        const data = await result.json();
        
        if (data && data[0]?.result?.data?.json) {
          setSubmissions(data[0].result.data.json);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      new: { label: "新訊息", variant: "default" },
      read: { label: "已閱讀", variant: "secondary" },
      replied: { label: "已回覆", variant: "outline" },
      archived: { label: "已歸檔", variant: "destructive" },
    };
    const config = statusMap[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      "1": "求才企業",
      "2": "求職者",
      "3": "其他",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">聯絡表單提交</h1>
          <p className="text-muted-foreground">
            共有 {submissions.length} 條提交記錄
          </p>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">暫無提交記錄</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedId(selectedId === submission.id ? null : submission.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {submission.lastName}
                          {submission.firstName}
                        </CardTitle>
                        <Badge variant="outline">{getCategoryLabel(submission.category)}</Badge>
                        {getStatusBadge(submission.status)}
                      </div>
                      <CardDescription>
                        {submission.subject}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      {format(new Date(submission.createdAt), "yyyy-MM-dd HH:mm", { locale: zhTW })}
                    </div>
                  </div>
                </CardHeader>

                {selectedId === submission.id && (
                  <CardContent className="border-t pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-sm">{submission.email}</p>
                        </div>
                        {submission.phone && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">電話</p>
                            <p className="text-sm">{submission.phone}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">訊息內容</p>
                        <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                          {submission.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
