
import { MobileSidebar } from "@/components/mobile-sidebar";
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



export function Navbar({ settings, setSettings, appState, generatedCode, referenceImages, generationStatus, followupUpdate, setFollowupUpdate, applyUpdate, downloadCode, reset }: Props) {

  return ( 
    <div className="flex items-center p-4">
      <MobileSidebar settings={settings} setSettings={setSettings} appState={appState} generatedCode={generatedCode} referenceImages={referenceImages} generationStatus={generationStatus} followupUpdate={followupUpdate} setFollowupUpdate={setFollowupUpdate} applyUpdate={applyUpdate} downloadCode={downloadCode} reset={reset} />
    </div>
   );
}
 
