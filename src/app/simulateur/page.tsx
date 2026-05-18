"use client";

import Link from "next/link";
import { useEffect } from "react";
import { simulatorBody, simulatorScript } from "@/lib/simulator-content";

export default function SimulateurPage() {
  useEffect(() => {
    if (document.getElementById("bankin-sim-runtime")) return;
    const tag = document.createElement("script");
    tag.id = "bankin-sim-runtime";
    tag.text = simulatorScript;
    document.body.appendChild(tag);
  }, []);

  return (
    <>
      <header className="sim-topbar">
        <Link href="/" className="sim-brand">
          <span className="sim-logo">B</span>
          <span>Bankin'</span>
        </Link>
        <Link href="/" className="sim-back">← Retour à l'accueil</Link>
      </header>
      <div dangerouslySetInnerHTML={{ __html: simulatorBody }} />
    </>
  );
}
