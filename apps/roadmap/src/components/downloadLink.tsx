import { IconButton, IconDownloadLine, Link } from "@instructure/ui";
import { useMemo } from "react";

interface DownloadLinkProps {
  href: string; // Can be a URL or raw SVG markup
  filename: string;
  type: "svg" | "png" | "ico" | "css" | "js";
}

const mimeTypes: Record<DownloadLinkProps["type"], string> = {
  css: "text/css",
  ico: "image/x-icon",
  js: "application/javascript",
  png: "image/png",
  svg: "image/svg+xml",
};

const DownloadLink = ({ href, filename, type }: DownloadLinkProps) => {
  const url = useMemo(() => {
    // If href is a URL (starts with http or /), use it directly
    if (/^(https?:)?\//.test(href)) {
      return href;
    }
    // For SVG markup, create a Blob
    if (type === "svg" && href.trim().startsWith("<svg")) {
      const blob = new Blob([href], { type: mimeTypes.svg });
      return URL.createObjectURL(blob);
    }
    // For text assets (raw content only)
    if (type === "css" || type === "js") {
      const blob = new Blob([href], { type: mimeTypes[type] });
      return URL.createObjectURL(blob);
    }
    // For other images, use the URL directly
    return href;
  }, [href, type]);

  return (
    <Link href={url} download={filename} aria-label={`Download ${filename}`}>
      <IconButton screenReaderLabel={`Download ${filename}`} size="small">
        <IconDownloadLine />
      </IconButton>
    </Link>
  );
};

export default DownloadLink;
