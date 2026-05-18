"use client";

import { useEffect } from "react";
import { simulatorBody, simulatorScript } from "@/lib/simulator-content";

export default function Page() {
  useEffect(() => {
    if (document.getElementById("bankin-sim-runtime")) return;
    const tag = document.createElement("script");
    tag.id = "bankin-sim-runtime";
    tag.text = simulatorScript;
    document.body.appendChild(tag);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: simulatorBody }} />;
}
