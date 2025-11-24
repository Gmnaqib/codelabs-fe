"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect } from "react";

export default function AutoTitle() {
  const segments = useSelectedLayoutSegments();

  // Ambil segment terakhir
  const last = segments[segments.length - 1] || "Home";

  // Ubah ke Title Case
  const title = last.charAt(0).toUpperCase() + last.slice(1);

  useEffect(() => {
    document.title = `${title} | myCodeLabs`;
  }, [title]);

  return null;
}
