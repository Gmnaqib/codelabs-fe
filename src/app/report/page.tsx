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
import { Button } from "@/components/ui/button";

const WeeklyReport = () => {
  const [activePage, setActivePage] = useState<string>("");

  // 🧩 State untuk form Add New Plan
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState("");
  const [progress, setProgress] = useState("");
  const [link, setLink] = useState("");
  const [challenge, setChallenge] = useState("");

  // 🧩 Handler submit POST /research
  const handleSubmit = async () => {
    // validasi sederhana
    if (!title || !week || !progress) {
      alert("Harap isi semua field wajib (Title, Week, Progress)");
      return;
    }

    // convert "Week 1" → 1
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
      console.log("✅ Research created:", res);
      alert("Research berhasil ditambahkan!");
      // reset form
      setTitle("");
      setWeek("");
      setProgress("");
      setLink("");
      setChallenge("");
    } catch (error) {
      console.error("❌ Gagal membuat research:", error);
      alert("Gagal menambahkan research. Cek console untuk detail.");
    }
  };

  return (
    <div>
      <Card>
        <div className="flex w-full justify-between">
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
            <DialogField name="Add New Plan" title="Add New Plan">
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
                    title="Week"
                    menu={["Week 1", "Week 2", "Week 3", "Week 4"]}
                    label="Week"
                    onChange={(value) => setWeek(value)} // ✅ sudah diperbaiki
                  />
                  <DropdownField
                    key="progress-input"
                    title="Progress"
                    menu={["Finished", "Unfinished"]}
                    label="Progress"
                    onChange={(value) => setProgress(value)} // ✅ sudah diperbaiki
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

                <Button onClick={handleSubmit} className="mt-3">
                  Submit
                </Button>
              </div>
            </DialogField>
          </div>
        </div>

        <TableField
          activePage={activePage}
          onPageChange={setActivePage}
          showMenu={false}
        />
      </Card>
    </div>
  );
};

export default WeeklyReport;
