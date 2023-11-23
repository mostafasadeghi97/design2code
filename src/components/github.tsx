import { StarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "./settings-dialog";

interface Props {
  settings: Settings;
}

export function Github({ settings }: Props) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>design2code</CardTitle>
          <CardDescription>Convert any design to code</CardDescription>
        </div>
        <div className="rounded-md">
          <Button
            variant="default"
            className="shadow-none"
            onClick={() => {
              window.open(
                "https://github.com/mostafasadeghi97/design2code",
                "_blank"
              );
            }}
          >
            <StarIcon className="mr-2 h-4" />
            Star Repo
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!settings.openAiApiKey ? (
          <div className="flex space-x-4 text-sm text-muted-foreground">
            Please add your OpenAI API key (must have GPT4 vision access) in the
            settings dialog above.
            <br />
            Create an OpenAI account if you don&apos;t have one. Then, you need
            to buy at least $1 worth of credit on the Billing dashboard.
            <br />
            The API key is never stored. Check the code to confirm.
          </div>
        ) : (
          <div className="flex space-x-4 text-sm text-muted-foreground">
            Upload a design image to get started.
          </div>
        )}
        <div className="mt-2 grid w-full">
          <Button
            variant="default"
            className="shadow-none"
            onClick={() => {
              window.open(
                "https://bytebeatbulletin.beehiiv.com/subscribe",
                "_blank"
              );
            }}
          >
            Join my newsletter for updates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
