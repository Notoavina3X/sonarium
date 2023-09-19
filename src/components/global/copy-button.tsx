import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

function CopyButton({ text }: { text: string | undefined }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((e) => {
        toast.error("Can't copy to clipboard");
        console.error(e);
      });
  };

  return (
    <Tooltip content="Copy to clipboard" placement="bottom">
      {copied ? (
        <Icon icon="tabler:check" />
      ) : (
        <button
          onClick={() => void copyToClipboard()}
          className="active:outline-none"
        >
          <Icon icon="solar:copy-bold" />
        </button>
      )}
    </Tooltip>
  );
}

export default CopyButton;
