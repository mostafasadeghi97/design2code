"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { Settings } from "@/components/settings-dialog";
import UploadDoprzone from "@/components/upload-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { GenerationParams } from "@/lib/generation-params";
import Preview from "@/components/preview";

import { Monitor, Smartphone, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeMirror from "@/components/code-mirror";

const Dashboard = () => {
  const { toast } = useToast();

  const [settings, setSettings] = useState<Settings>({
    openAiApiKey: null,
    editorTheme: "cobalt",
  });

  const [appState, setAppState] = useState<
    "INITIAL" | "GENERATING" | "CODE_READY"
  >("INITIAL");

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generationStatus, setGenerationStatus] = useState<string[]>([]);
  const [followupUpdate, setFollowupUpdate] = useState("");

  const reset = () => {
    setAppState("INITIAL");
    setGeneratedCode("");
    setReferenceImages([]);
    setGenerationStatus([]);
    setMessageHistory([]);
  };

  const downloadCode = () => {
    // Create a blob from the generated code
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function applyCodeGeneration(params: GenerationParams) {
    setGenerationStatus([]);
    setAppState("GENERATING");

    if (settings.openAiApiKey) {
      params.openAiApiKey = settings.openAiApiKey;
    } else {
      params.openAiApiKey = "sk-...";
    }

    startGenerateCode({ params });
  }

  function doCreate(referenceImages: string[]) {
    setReferenceImages(referenceImages);
    if (referenceImages.length > 0) {

      applyCodeGeneration({
        generationType: "create",
        image: referenceImages[0],
        messageHistory: [],
        ...settings,
      });
    }
  }

  // Subsequent updates
  function applyUpdate() {
    const updatedHistory = [...messageHistory, generatedCode, followupUpdate];

    applyCodeGeneration({
      generationType: "update",
      image: referenceImages[0],
      messageHistory: updatedHistory,
      ...settings,
    });

    setMessageHistory(updatedHistory);
    setGeneratedCode("");
    setFollowupUpdate("");
  }

  const { mutate: startGenerateCode } = useMutation({
    mutationFn: async ({ params }: { params: GenerationParams }) => {
      
      const response = await fetch("/api/code", {
        method: "POST",
        body: JSON.stringify({
          ...params,
        }),
      });

      if (!response.ok) {

        if (response.status === 401) {
          toast({
            title: "Invalid OpenAI API key",
            description:
              "Please check your OpenAI API key in the settings and try again.",
            variant: "destructive",
          });
        }

        if (response.status === 500) {
          toast({
            title: "Something went wrong",
            description:
              "Please refresh this page and try again.",
            variant: "destructive",
          });
        }

        throw new Error("Failed to generate code");
      }

      return response.body;
    },
    onMutate: async ({ params }) => {
      setAppState("GENERATING");
      setGenerationStatus((prev) => [...prev, "Generating code..."]);
    },

    onSuccess: async (stream) => {
      if (!stream) {
        return toast({
          title: "There was a problem generating code",
          description: "Please check the console for more details",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        if (chunkValue) {
          setGeneratedCode((prev) => prev + chunkValue);
        }
      }
    },

    onError: () => {
      
    },
    onSettled: async () => {
      setGenerationStatus((prev) => [...prev, "Code generation completed"]);
      setAppState("CODE_READY");
    },
  });

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-96 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Sidebar
          settings={settings}
          setSettings={setSettings}
          appState={appState}
          generatedCode={generatedCode}
          referenceImages={referenceImages}
          generationStatus={generationStatus}
          followupUpdate={followupUpdate}
          setFollowupUpdate={setFollowupUpdate}
          applyUpdate={applyUpdate}
          downloadCode={downloadCode}
          reset={reset}
        />
      </div>
      <main className="md:pl-96 pb-10">
        <Navbar
          settings={settings}
          setSettings={setSettings}
          appState={appState}
          generatedCode={generatedCode}
          referenceImages={referenceImages}
          generationStatus={generationStatus}
          followupUpdate={followupUpdate}
          setFollowupUpdate={setFollowupUpdate}
          applyUpdate={applyUpdate}
          downloadCode={downloadCode}
          reset={reset}
        />

        {appState === "INITIAL" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <UploadDoprzone setReferenceImages={doCreate} />
          </div>
        ) : null}

        {(appState === "GENERATING" || appState === "CODE_READY") && (
          <div className="ml-4">
            <Tabs defaultValue="desktop">
              <div className="flex justify-end mr-8 mb-4">
                <TabsList>
                  <TabsTrigger value="desktop" className="flex gap-x-2">
                    <Monitor /> Desktop
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex gap-x-2">
                    <Smartphone /> Mobile
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex gap-x-2">
                    <Code />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="desktop">
                <Preview code={generatedCode} device="desktop" />
              </TabsContent>
              <TabsContent value="mobile">
                <Preview code={generatedCode} device="mobile" />
              </TabsContent>
              <TabsContent value="code">
                <CodeMirror
                  code={generatedCode}
                  editorTheme={settings.editorTheme}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
