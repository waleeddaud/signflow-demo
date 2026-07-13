"use client";

import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type SignaturePadProps = {
  onSignatureChange: (dataUrl: string | null) => void;
  disabled?: boolean;
  error?: string;
};

export function SignaturePad({
  onSignatureChange,
  disabled = false,
  error,
}: SignaturePadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SignatureCanvas>(null);
  const [canvasWidth, setCanvasWidth] = useState(560);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = Math.floor(el.clientWidth);
      if (width > 0) setCanvasWidth(width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    canvasRef.current?.clear();
    onSignatureChange(null);
    // Re-initialize canvas when width changes; intentional reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- width-driven remount of drawing surface
  }, [canvasWidth]);

  const emitChange = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.isEmpty()) {
      onSignatureChange(null);
      return;
    }
    onSignatureChange(canvas.toDataURL("image/png"));
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink" id="signature-label">
            Drawn signature
          </p>
          <p className="mt-0.5 text-sm text-muted" id="signature-hint">
            Sign using a mouse, trackpad, or touchscreen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="shrink-0 rounded border border-border bg-paper px-3 py-1.5 text-sm font-medium text-body transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear signature
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded border border-border bg-paper touch-none"
      >
        <SignatureCanvas
          ref={canvasRef}
          penColor="#14213D"
          backgroundColor="#FFFFFF"
          canvasProps={{
            width: canvasWidth,
            height: 180,
            className: "block w-full cursor-crosshair",
            role: "img",
            "aria-labelledby": "signature-label",
            "aria-describedby": error
              ? "signature-error signature-hint"
              : "signature-hint",
            style: { width: "100%", height: "180px", touchAction: "none" },
          }}
          onEnd={emitChange}
        />
      </div>

      {error ? (
        <p id="signature-error" className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
