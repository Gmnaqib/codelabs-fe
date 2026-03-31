"use client";
import DialogField from "@/components/custom-ui/DialogField";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { createResearchRecord } from "@/services/research/researchService";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";

const WeeklyReport = () => {
  const [activePage, setActivePage] = useState<string>("report");
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [progress, setProgress] = useState("");
  const [link, setLink] = useState("");
  const [challenge, setChallenge] = useState("");
  const [filterWeek, setFilterWeek] = useState("All");
  const [filterProgress, setFilterProgress] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const handleSubmit = async () => {
    if (!title || !week || !progress) {
      showErrorToast("Harap isi semua field wajib (Title, Week, Progress)", {
        duration: 5000,
      });
      return;
    }

    if (link && !/^https:\/\/.+/i.test(link)) {
      showErrorToast("Link harus diawali dengan 'https://'", {
        duration: 5000,
      });
      return;
    }

    const weekNumber = parseInt(week.replace("Week ", "")) || 1;

    const payload = {
      week: weekNumber,
      category: "personal",
      research_type: "Literature Review",
      title,
      link: link || "https://example.com/research",
      progress: progress.toLowerCase(),
      challenge,
    };

    try {
      await createResearchRecord(payload);
      toast.success("Data Berhasil Ditambahkan");
      setTitle("");
      setWeek("");
      setProgress("");
      setLink("");
      setChallenge("");
      setIsDialogOpen(false);
      setFetchTrigger(Date.now());
    } catch (error: unknown) {
      let errMsg = "Gagal menambahkan research.";
      if (error && typeof error === "object") {
        errMsg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
          || (error as { message?: string })?.message
          || errMsg;
      }
      showErrorToast(errMsg, { duration: 5000 });
    }
  };

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex flex-col w-full justify-between mb-10 md:flex-row">
          <div className="flex flex-col gap-3 md:gap-5 md:flex-row">
            <CalendarMonthYearPicker 
              onChange={({ month, year }) => {
                setSelectedMonth(month + 1); 
                setSelectedYear(year);
              }}
            />

            <DropdownField
              key="week-filter"
              title="Week"
              menu={["All", "Week 1", "Week 2", "Week 3", "Week 4"]}
              onChange={(value) => setFilterWeek(value)}
            />

            <DropdownField
              key="progress-filter"
              title="Progress"
              menu={["All", "Finished", "Unfinished"]}
              onChange={(value) => setFilterProgress(value)}
            />
          </div>

          <div className="mt-3">
            {(() => {
              const isLinkValid = link.startsWith("https://");
              const isFormIncomplete = !title || !week || !progress || !link || !challenge || !isLinkValid;
              return (
                <DialogField
                  name="Add New Plan"
                  title="Add New Plan"
                  size="full"
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  onSubmit={handleSubmit}
                  submitDisabled={isFormIncomplete}
                >
                  <div className="flex flex-col gap-5">
                    <InputField
                      type="string"
                      placeholder="Ex: Learn how to make responsive web"
                      label="Title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />

                    <div className="flex gap-5">
                      <DropdownField
                        key="week-input"
                        title="Choose Week"
                        menu={["Week 1", "Week 2", "Week 3", "Week 4"]}
                        label="Week"
                        onChange={(value) => setWeek(value)}
                      />
                      <DropdownField
                        key="progress-input"
                        title="Your Progress"
                        menu={["Finished", "Unfinished"]}
                        label="Progress"
                        onChange={(value) => setProgress(value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <InputField
                        type="string"
                        placeholder="Ex: https://github.com/unikom-codelabs/"
                        label="Link"
                        value={link}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                      />
                      {link && !isLinkValid && (
                        <span className="text-sm text-red-500">Link harus diawali dengan &#39;https://&#39;</span>
                      )}
                    </div>

                    <Textarea
                      label="Challenge"
                      placeholder="Ex: Ada kendala pada fitur upload gambar..."
                      value={challenge}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChallenge(e.target.value)}
                    />
                  </div>
                </DialogField>
              );
            })()}
          </div>
        </div>
        <Card>
          <div className="p-5">
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={false}
              filterWeek={filterWeek}
              filterProgress={filterProgress}
              month={selectedMonth}
              year={selectedYear}
              fetchTrigger={fetchTrigger}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default WeeklyReport;
