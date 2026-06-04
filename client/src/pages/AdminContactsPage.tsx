import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";

const categoryLabels: Record<string, string> = {
  "1": "求才企業",
  "2": "合作詢問",
  "3": "測驗結果應用與生涯諮詢",
  "4": "申訴反應",
  "5": "其他事項",
};

const statusLabels: Record<string, string> = {
  new: "新訊息",
  read: "已閱讀",
  replied: "已回覆",
  archived: "已歸檔",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  replied: "bg-green-100 text-green-800",
  archived: "bg-gray-200 text-gray-600",
};

export default function AdminContactsPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">無權限訪問</h1>
        <p className="text-gray-600">您沒有權限訪問此頁面。</p>
      </div>
    );
  }

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = trpc.contact.getStats.useQuery();

  // Fetch submissions list
  const { data: submissions, isLoading: submissionsLoading, refetch } = trpc.contact.list.useQuery({
    status: selectedStatus as any,
    limit: 50,
    offset: 0,
  });

  // Fetch selected submission details
  const { data: selectedSubmissionData } = trpc.contact.getById.useQuery(
    { id: selectedSubmission || 0 },
    { enabled: !!selectedSubmission }
  );

  // Update status mutation
  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedSubmission(null);
    },
  });

  const handleStatusChange = (submissionId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: submissionId,
      status: newStatus as any,
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">聯絡表單管理</h1>
        <p className="text-gray-600">查看和管理所有聯絡表單提交</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600">總計</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">新訊息</div>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">已閱讀</div>
            <div className="text-2xl font-bold text-gray-600">{stats.read}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">已回覆</div>
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">已歸檔</div>
            <div className="text-2xl font-bold text-gray-400">{stats.archived}</div>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        <Select value={selectedStatus || ""} onValueChange={(v) => setSelectedStatus(v || undefined)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="篩選狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部狀態</SelectItem>
            <SelectItem value="new">新訊息</SelectItem>
            <SelectItem value="read">已閱讀</SelectItem>
            <SelectItem value="replied">已回覆</SelectItem>
            <SelectItem value="archived">已歸檔</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">提交列表</h2>
            {submissionsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedSubmission === submission.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">
                          {submission.lastName}
                          {submission.firstName}
                        </div>
                        <div className="text-sm text-gray-600">{submission.email}</div>
                      </div>
                      <Badge className={statusColors[submission.status]}>
                        {statusLabels[submission.status]}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {categoryLabels[submission.category]} • {submission.subject}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(submission.createdAt).toLocaleString("zh-TW")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                沒有找到相關提交
              </div>
            )}
          </Card>
        </div>

        {/* Details Panel */}
        <div>
          {selectedSubmissionData ? (
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">詳細信息</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600">姓名</div>
                  <div className="text-lg">
                    {selectedSubmissionData.lastName}
                    {selectedSubmissionData.firstName}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600">Email</div>
                  <div className="text-sm break-all">{selectedSubmissionData.email}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600">電話</div>
                  <div className="text-sm">{selectedSubmissionData.phone || "未提供"}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600">類別</div>
                  <div className="text-sm">
                    {categoryLabels[selectedSubmissionData.category]}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600">主旨</div>
                  <div className="text-sm">{selectedSubmissionData.subject || "未提供"}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600">訊息</div>
                  <div className="text-sm bg-gray-50 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {selectedSubmissionData.message}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-2">狀態</div>
                  <Select
                    value={selectedSubmissionData.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedSubmissionData.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">新訊息</SelectItem>
                      <SelectItem value="read">已閱讀</SelectItem>
                      <SelectItem value="replied">已回覆</SelectItem>
                      <SelectItem value="archived">已歸檔</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-gray-500 pt-4 border-t">
                  提交時間：{new Date(selectedSubmissionData.createdAt).toLocaleString("zh-TW")}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                選擇一個提交以查看詳細信息
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
