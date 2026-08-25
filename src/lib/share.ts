import { toast } from "sonner";

export async function shareOrCopy(url: string, title: string, text: string) {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator).share({ title, text, url });
      return "shared" as const;
    } catch {
      /* user dismissed — fall through to copy */
    }
  }
  return copy(url);
}

export async function copy(value: string) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(value);
      toast.success("Link copied — go send it");
      return "copied" as const;
    }
  } catch {
    /* fall through */
  }
  toast.error("Couldn't copy. Long-press the link to copy it manually.");
  return "failed" as const;
}
