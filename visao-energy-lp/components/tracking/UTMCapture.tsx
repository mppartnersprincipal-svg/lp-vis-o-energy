"use client";

import { useEffect } from "react";
import { parseUtms, storeUtms } from "@/lib/utm";

/** Captura UTMs da URL de entrada e guarda na sessão (first-touch). */
export function UTMCapture() {
  useEffect(() => {
    storeUtms(parseUtms(window.location.search));
  }, []);
  return null;
}
