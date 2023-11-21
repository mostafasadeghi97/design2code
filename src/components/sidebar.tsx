"use client";

import { Montserrat } from "next/font/google";
import { Github } from "./github";
import { SettingsDialog, Settings } from "./settings-dialog";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CodePreview from "@/components/code-preview";
import { Download, Undo } from "lucide-react";


const poppins = Montserrat({ weight: "600", subsets: ["latin"] });

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

export function Sidebar({ settings, setSettings, appState, generatedCode, referenceImages, generationStatus, followupUpdate, setFollowupUpdate, applyUpdate, downloadCode, reset }: Props) {
  console.log("settings", settings);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        
        <h1 className={cn("text-2xl font-bold mx-2 mb-4", poppins.className)}>
          Design 2 Code
        </h1>
        
        

        <div className="space-y-1">
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </div>

        {/* if settings.openapikey then show */}
        
          <div className="my-4">
            <Github settings={settings} />
          </div>
        

        {(appState === "GENERATING" || appState === "CODE_READY") && (
          <>
            {/* Show code preview only when GENERATING */}
            {appState === "GENERATING" && (
              <div className="flex flex-col mt-4">
                <div className="flex items-center gap-x-1">
                  <Spinner />
                  {generationStatus.slice(-1)[0]}
                </div>
                <CodePreview code={generatedCode} />
              </div>
            )}

            {appState === "CODE_READY" && (
              <div>
                <div className="grid w-full gap-2">
                  <Textarea
                    placeholder="Tell the AI what to change..."
                    onChange={(e) => setFollowupUpdate(e.target.value)}
                    value={followupUpdate}
                    className="text-black"
                  />
                  <Button onClick={applyUpdate} variant={"secondary"} className="mt-2">Update</Button>
                </div>
                <div className="grid grid-cols-2 gap-2 my-4">
                  <Button
                    onClick={downloadCode}
                    
                    variant={"secondary"}
                  >
                    <Download /> Download Code
                  </Button>
                  <Button onClick={reset} 
                  variant={"destructive"}>
                    <Undo />
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Reference image display */}
            <div className="flex gap-x-2 mt-2">
              <div className="flex flex-col">
                <div
                  className={cn({
                    "scanning relative": appState === "GENERATING",
                  })}
                >
                  <img
                    className="w-[360px] max-h-[330px] border border-gray-200 rounded-md"
                    src={referenceImages[0]}
                    alt="Reference"
                  />
                </div>
                <div className="text-gray-400 uppercase text-sm text-center mt-1">
                  Original Design
                </div>
              </div>
              <div className="bg-gray-400 px-4 py-2 rounded text-sm hidden">
                <h2 className="text-lg mb-4 border-b border-gray-800">
                  Console
                </h2>
                {generationStatus.map((line, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-400 mb-2 text-gray-600 font-mono"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        
      </div>
      {/* <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      /> */}
    </div>
  );
}
