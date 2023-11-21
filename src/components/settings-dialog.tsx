import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from 'react'
import { cn } from "@/lib/utils"




export interface Settings {
    openAiApiKey: string | null;
    editorTheme: string;
  }
  

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export function SettingsDialog({ settings, setSettings }: Props) {
  const handleThemeChange = (theme: string) => {
    setSettings((s) => ({
      ...s,
      editorTheme: theme,
    }));
  };
    
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
          onClick={() => setIsOpen(true)}
          asChild>
          <div
              
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                "text-zinc-100",
              )}
            >
              <div className="flex items-center flex-1">
                <SettingsIcon className={cn("h-5 w-5 mr-3")} />
                Settings
              </div>
            </div>
        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <Label htmlFor="openai-api-key">
            <div>OpenAI API key</div>
            
          </Label>

          <Input
            id="openai-api-key"
            placeholder="OpenAI API key"
            value={settings.openAiApiKey || ""}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                openAiApiKey: e.target.value,
              }))
            }
          />
          
        </div>

        <DialogFooter>
          <DialogClose>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
