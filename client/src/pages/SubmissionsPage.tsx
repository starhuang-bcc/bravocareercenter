import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Trash2, Search } from "lucide-react";

interface ContactSubmission {
  id: number;
  category: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: Date | number;
  updatedAt?: Date;
}

const CATEGORY_MAP: Record<string, string> = {
  "1": "求才企業",
  "2": "合作詢問",
  "3": "測驗結果應用與生涯諮詢",
  "4": "申訴反應",
  "5": "其他事項",
};

export default function SubmissionsPage() {
  const [, setLocation] = useLocation();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [password, setPassword] = useState("");
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const deleteMultipleMutation = trpc.contact.deleteMultiple.useMutation();

  // 檢查登錄狀態並獲取密碼
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    const storedPassword = localStorage.getItem("adminPassword");
    
    if (!isLoggedIn || !storedPassword) {
      setLocation("/admin");
    } else {
      setPassword(storedPassword);
    }
  }, [setLocation]);

  // 使用 tRPC 查詢提交列表
  const { data: listData, isLoading } = trpc.contact.list.useQuery(
    {
      password,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      keyword: searchKeyword || undefined,
    },
    {
      enabled: !!password, // 只在有密碼時才查詢
    }
  );

  // 更新提交列表
  useEffect(() => {
    if (listData && Array.isArray(listData)) {
      setSubmissions(listData);
    }
  }, [listData]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminPassword");
    setLocation("/");
  };

  // 當篩選條件改變時，清空選中狀態
  useEffect(() => {
    setSelectedIds(new Set());
  }, [selectedCategory, searchKeyword]);

  // 過濾提交
  useEffect(() => {
    let filtered = submissions;

    // 按分類過濾
    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // 按關鍵字搜尋
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.lastName.toLowerCase().includes(keyword) ||
          s.firstName.toLowerCase().includes(keyword) ||
          s.email.toLowerCase().includes(keyword) ||
          (s.subject?.toLowerCase().includes(keyword) || false) ||
          s.message.toLowerCase().includes(keyword)
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, selectedCategory, searchKeyword]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  // Update checkbox indeterminate state
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        selectedIds.size > 0 && selectedIds.size < filteredSubmissions.length;
    }
  }, [selectedIds, filteredSubmissions]);

  const handleSelectId = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) {
      alert("請先選擇要刪除的記錄");
      return;
    }

    if (!confirm(`確定要刪除 ${selectedIds.size} 條記錄嗎？此操作無法撤銷。`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteMultipleMutation.mutateAsync({
        ids: Array.from(selectedIds),
        password,
      });
      
      // 刪除成功後，清空選中的 ID 並重新獲取列表
      setSelectedIds(new Set());
      // 重新獲取列表
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete submissions:", error);
      alert("刪除失敗，請重試");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORY_MAP[category] || category;
  };

  const formatDate = (timestamp: number | Date) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return format(date, "yyyy-MM-dd HH:mm", { locale: zhTW });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">聯絡表單提交</h1>
            <p className="text-gray-600 mt-2">
              共有 {submissions.length} 條提交記錄 (總計 {submissions.length} 條)
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100"
          >
            登出
          </Button>
        </div>

        {/* Select All and Bulk Actions */}
        {filteredSubmissions.length > 0 && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    checked={selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedIds.size === 0
                      ? `全選 (${filteredSubmissions.length} 條)`
                      : `已選擇 ${selectedIds.size} / ${filteredSubmissions.length} 條`}
                  </span>
                </div>
                {selectedIds.size > 0 && (
                  <Button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={18} className="mr-2" />
                    {deleteLoading ? "刪除中..." : `刪除選中 (${selectedIds.size})`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Search Bar */}
            <div className="mb-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="搜尋姓名、Email、主旨或訊息內容..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory("all")}
                variant={selectedCategory === "all" ? "default" : "outline"}
                className={selectedCategory === "all" ? "bg-blue-600" : ""}
              >
                全部
              </Button>
              {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className={selectedCategory === key ? "bg-blue-600" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>


          </CardContent>
        </Card>

        {/* Submissions List */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">載入中...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">暫無符合條件的提交記錄</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card
                key={submission.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(submission.id)}
                        onChange={() => handleSelectId(submission.id)}
                        className="mt-1 w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {submission.lastName}
                            {submission.firstName}
                          </CardTitle>
                          <Badge variant="outline">
                            {getCategoryLabel(submission.category)}
                          </Badge>
                          <Badge
                            variant={
                              submission.status === "new"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {submission.status === "new" ? "未讀" : "已讀"}
                          </Badge>
                        </div>
                        <CardDescription>
                          {submission.subject}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                </CardHeader>

                {selectedId === submission.id && (
                  <CardContent className="bg-gray-50 border-t">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Email
                        </p>
                        <p className="text-gray-600">{submission.email}</p>
                      </div>
                      {submission.phone && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            電話
                          </p>
                          <p className="text-gray-600">{submission.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          訊息內容
                        </p>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {submission.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}

                <div
                  onClick={() =>
                    setSelectedId(
                      selectedId === submission.id ? null : submission.id
                    )
                  }
                  className="px-6 py-3 bg-gray-50 border-t text-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  {selectedId === submission.id ? "隱藏詳細信息" : "查看詳細信息"}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
