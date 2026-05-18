"use client";

import { useEffect } from "react";
import { simulatorBody, simulatorScript } from "@/lib/simulator-content";

export default function Page() {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.id = "bankin-sim-runtime";
    tag.text = simulatorScript;
    document.body.appendChild(tag);
    return () => {
      tag.remove();
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: simulatorBody }} />;
}
