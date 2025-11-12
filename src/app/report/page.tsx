"use client";
import DialogField from "@/components/custom-ui/DialogField";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import FilterMonth from "@/components/custom-ui/FilterMonth";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { createResearchRecord } from "@/services/research/researchService";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";

const WeeklyReport = () => {
  const [activePage, setActivePage] = useState<string>("");

  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [progress, setProgress] = useState("");
  const [link, setLink] = useState("");
  const [challenge, setChallenge] = useState("");

  // 🔒 kontrol dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      const res = await createResearchRecord(payload);
      toast.success("Data Berhasil Ditambahkan");

      // reset form
      setTitle("");
      setWeek("");
      setProgress("");
      setLink("");
      setChallenge("");

      // 🚀 TUTUP DIALOG SECARA OTOMATIS
      setIsDialogOpen(false);
    } catch (error) {
      showErrorToast("Gagal menambahkan research.", {
        duration: 5000,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex w-full justify-between mb-10">
        <div className="flex gap-7">
          <FilterMonth />
          <DropdownField
            key="week-filter"
            title="Week"
            menu={["All", "Week 1", "Week 2", "Week 3", "Week 4"]}
          />
          <DropdownField
            key="progress-filter"
            title="Progress"
            menu={["All", "Finished", "Unfinished"]}
          />
        </div>
        <div>
          <DialogField
            name="Add New Plan"
            title="Add New Plan"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-5">
              <InputField
                type="string"
                placeholder="Ex: Learn how to make responsive web"
                label="Title"
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
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

              <InputField
                type="string"
                placeholder="Ex: https://github.com/unikom-codelabs/"
                label="Link"
                value={link}
                onChange={(e: any) => setLink(e.target.value)}
              />

              <Textarea
                label="Challenge"
                placeholder="Ex: Ada kendala pada fitur upload gambar..."
                value={challenge}
                onChange={(e: any) => setChallenge(e.target.value)}
              />
            </div>
          </DialogField>
        </div>
      </div>

      <Card>
        <div className="px-5">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={false}
          />
        </div>
      </Card>
    </ProtectedRoute>
  );
};

export default WeeklyReport;
