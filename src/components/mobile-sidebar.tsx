"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { Settings }  from "./settings-dialog";


interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  appState: string;
  generatedCode: string;
  referenceImages: string[];
  generationStatus: string[];
  followupUpdate: string;
  setFollowupUpdate: React.Dispatch<React.SetStateAction<string>>;
  applyUpdate: () => void;
  downloadCode: () => void;
  reset: () => void;

}


export function MobileSidebar({ settings, setSettings, appState, generatedCode, referenceImages, generationStatus, followupUpdate, setFollowupUpdate, applyUpdate, downloadCode, reset }: Props) {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
          <Menu className="md:hidden"  />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
      <Sidebar settings={settings} setSettings={setSettings} appState={appState} generatedCode={generatedCode} referenceImages={referenceImages} generationStatus={generationStatus} followupUpdate={followupUpdate} setFollowupUpdate={setFollowupUpdate} applyUpdate={applyUpdate} downloadCode={downloadCode} reset={reset} />
      </SheetContent>
    </Sheet>
  );
};