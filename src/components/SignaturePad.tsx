"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const onChangeRef = useRef(onSignatureChange);
  const [canvasWidth, setCanvasWidth] = useState(560);
  const skipNextClear = useRef(true);

  useEffect(() => {
    onChangeRef.current = onSignatureChange;
  }, [onSignatureChange]);

  useLayoutEffect(() => {
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
    if (skipNextClear.current) {
      skipNextClear.current = false;
      return;
    }
    canvasRef.current?.clear();
    onChangeRef.current(null);
  }, [canvasWidth]);

  const emitChange = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.isEmpty()) {
      onChangeRef.current(null);
      return;
    }
    onChangeRef.current(canvas.toDataURL("image/png"));
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    onChangeRef.current(null);
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
          className="shrink-0 touch-manipulation rounded border border-border bg-paper px-3 py-1.5 text-sm font-medium text-body transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear signature
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded border border-border bg-paper touch-none"
      >
        <SignatureCanvas
          key={canvasWidth}
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
            tabIndex: 0,
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
