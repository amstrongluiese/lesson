import { useCallback, useEffect, useRef, useState } from "react";

type State = {
  title: string;
  artist: string;
  timeCurrent: string;
  timeTotal: string;
  blur: number;
  grain: number;
  brightness: number;
  saturation: number;
  vignette: number;
  uiOffsetY: number;
  uiScale: number;
  showBackButton: boolean;
  showDetails: boolean;
  showHeart: boolean;
  showTimeline: boolean;
  showControls: boolean;
};

type AspectRatio = "9:16" | "4:5" | "1:1" | "2:3";

const ASPECT_RATIOS: Record<AspectRatio, { w: number; h: number; label: string }> = {
  "9:16": { w: 1080, h: 1920, label: "Story / Reel" },
  "4:5": { w: 1080, h: 1350, label: "Portrait Post" },
  "1:1": { w: 1080, h: 1080, label: "Square Post" },
  "2:3": { w: 1080, h: 1620, label: "Pinterest Pin" },
};

const VISIBLE_ELEMENTS: { key: keyof State; label: string }[] = [
    { key: "showBackButton", label: "Back Button" },
    { key: "showDetails", label: "Title & Artist" },
    { key: "showHeart", label: "Heart Icon" },
    { key: "showTimeline", label: "Timeline Bar & Times" },
    { key: "showControls", label: "Music Playback Buttons" },
];

const FILTERS: { key: keyof State; label: string, min: number, max: number, step: number }[] = [
    { key: "blur", label: "Aesthetic Blur", min: 0, max: 40, step: 0.5 },
    { key: "grain", label: "Analog Grain Noise", min: 0, max: 100, step: 1 },
    { key: "brightness", label: "Brightness Exposure", min: 20, max: 150, step: 1 },
    { key: "saturation", label: "Saturation / Vibrancy", min: 0, max: 200, step: 1 },
    { key: "vignette", label: "Ambient Shadow Depth", min: 0, max: 100, step: 1 },
];

const updateState = <K extends keyof State>(
  setState: React.Dispatch<React.SetStateAction<State>>,
  key: K,
  value: State[K]
) => {
  setState((prevState) => ({ ...prevState, [key]: value }));
};

export default function MusicPlayerGenerator() {
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [state, setState] = useState<State>({
    title: "POET NI LUIESE",
    artist: "Luiese",
    timeCurrent: "2:01",
    timeTotal: "3:19",
    blur: 0,
    grain: 40,
    brightness: 85,
    saturation: 80,
    vignette: 60,
    uiOffsetY: 100,
    uiScale: 1.0,
    showBackButton: true,
    showDetails: true,
    showHeart: true,
    showTimeline: true,
    showControls: true,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ y: 0, initialOffsetY: 0 });
  const toastRef = useRef<HTMLDivElement | null>(null);

  const CANVAS_W = ASPECT_RATIOS[aspectRatio].w;
  const CANVAS_H = ASPECT_RATIOS[aspectRatio].h;

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Helper: Generate Grain ---
    const generateNoise = () => {
      if (noiseCanvasRef.current) return noiseCanvasRef.current;
      const noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = CANVAS_W / 2;
      noiseCanvas.height = CANVAS_H / 2;
      const nCtx = noiseCanvas.getContext("2d");
      if (!nCtx) return noiseCanvas;
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      nCtx.putImageData(imgData, 0, 0);
      noiseCanvasRef.current = noiseCanvas;
      return noiseCanvas;
    };

    // --- Helper: Convert Time string "M:SS" to seconds ---
    const timeToSeconds = (timeStr: string) => {
      const parts = timeStr.split(":");
      if (parts.length !== 2) return 0;
      return parseInt(parts[0]) * 60 + parseInt(parts[1]) || 0;
    };

    // --- SVG Path Drawer Helper ---
    const drawPath = (pathStr: string, x: number, y: number, scale: number, strokeColor: string | null, fillColor: string | null, strokeWidth = 2, lineCap: CanvasLineCap = "round", lineJoin: CanvasLineJoin = "round") => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      const p = new Path2D(pathStr);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill(p);
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth / scale;
        ctx.lineCap = lineCap;
        ctx.lineJoin = lineJoin;
        ctx.stroke(p);
      }
      ctx.restore();
    };

    // 1. Clear Canvas
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Draw Background
    if (bgImage) {
      ctx.filter = `blur(${state.blur}px) brightness(${state.brightness}%) saturate(${state.saturation}%)`;
      const scale = Math.max(CANVAS_W / bgImage.width, CANVAS_H / bgImage.height);
      const x = CANVAS_W / 2 - (bgImage.width / 2) * scale;
      const y = CANVAS_H / 2 - (bgImage.height / 2) * scale;
      ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
      ctx.filter = "none";
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, "#1c1b26");
      grad.addColorStop(0.5, "#0e0e13");
      grad.addColorStop(1, "#050508");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // 3. Apply Effects
    if (state.grain > 0) {
      const noise = generateNoise();
      ctx.globalAlpha = state.grain / 300;
      ctx.globalCompositeOperation = "overlay";
      ctx.drawImage(noise, 0, 0, CANVAS_W, CANVAS_H);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
    }

    if (state.vignette > 0) {
      const radialGrad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.4, CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.75);
      radialGrad.addColorStop(0, "rgba(0,0,0,0)");
      radialGrad.addColorStop(1, `rgba(0,0,0,${(state.vignette / 100) * 0.85})`);
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const linearGrad = ctx.createLinearGradient(0, CANVAS_H * 0.35, 0, CANVAS_H);
      linearGrad.addColorStop(0, "rgba(0,0,0,0)");
      linearGrad.addColorStop(1, `rgba(0,0,0,${(state.vignette / 100) * 0.95})`);
      ctx.fillStyle = linearGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // 4. DRAW Pinned Static Back Button
    const marginX = 90;
    if (state.showBackButton) {
      const backBtnSize = 110;
      const backBtnY = 120;
      ctx.fillStyle = "rgba(18, 18, 24, 0.45)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(marginX, backBtnY, backBtnSize, backBtnSize, 36);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(marginX + 60, backBtnY + 34);
      ctx.lineTo(marginX + 40, backBtnY + 55);
      ctx.lineTo(marginX + 60, backBtnY + 76);
      ctx.stroke();
    }

    // 5. DRAW INTERACTIVE MUSIC PLAYER CONTROL PANEL
    ctx.save();
    ctx.translate(CANVAS_W / 2, CANVAS_H / 2 + state.uiOffsetY);
    ctx.scale(state.uiScale, state.uiScale);
    ctx.translate(-CANVAS_W / 2, -CANVAS_H / 2);

    const textY = 1000;

    if (state.showDetails) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 68px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(state.title.toUpperCase(), marginX, textY);
      ctx.font = "600 42px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fillText(state.artist.toUpperCase(), marginX, textY + 70);
    }

    if (state.showHeart) {
      const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
      drawPath(heartPath, CANVAS_W - marginX - 55, textY + 5, 2.5, null, "#ffffff");
    }

    const barY = 1190;
    const barWidth = CANVAS_W - marginX * 2;

    if (state.showTimeline) {
      const curSec = timeToSeconds(state.timeCurrent);
      const totSec = timeToSeconds(state.timeTotal);
      let progress = totSec > 0 ? curSec / totSec : 0;
      if (progress > 1) progress = 1;
      if (progress < 0) progress = 0;
      const activeWidth = barWidth * progress;

      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.beginPath();
      ctx.roundRect(marginX, barY, barWidth, 8, 4);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(marginX, barY, activeWidth, 8, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(marginX + activeWidth, barY + 4, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "500 28px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "left";
      ctx.fillText(state.timeCurrent, marginX, barY + 52);
      ctx.textAlign = "right";
      ctx.fillText(state.timeTotal, CANVAS_W - marginX, barY + 52);
    }

    if (state.showControls) {
      const controlsY = 1360;
      const centerY = controlsY + 45;

      const shufflePath = "M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5";
      drawPath(shufflePath, marginX, centerY - 25, 2.3, "rgba(255,255,255,0.75)", null, 2.5);

      const prevPath = "M19 20L9 12l10-8v16zM5 19V5h2v14H5z";
      drawPath(prevPath, 340, centerY - 28, 2.5, null, "#ffffff");

      const playCircleX = CANVAS_W / 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.arc(playCircleX, centerY, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(playCircleX, centerY, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#121216";
      ctx.beginPath();
      ctx.roundRect(playCircleX - 24, centerY - 25, 16, 50, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(playCircleX + 8, centerY - 25, 16, 50, 4);
      ctx.fill();

      const nextPath = "M5 4l10 8-10 8V4zM19 5v14h-2V5h2z";
      drawPath(nextPath, CANVAS_W - 340 - 60, centerY - 28, 2.5, null, "#ffffff");

      const repeatPath = "M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3";
      drawPath(repeatPath, CANVAS_W - marginX - 55, centerY - 25, 2.3, "rgba(255,255,255,0.75)", null, 2.5);
    }

    ctx.restore();
  }, [state.artist, state.blur, state.brightness, state.grain, state.saturation, state.showBackButton, state.showControls, state.showDetails, state.showHeart, state.showTimeline, state.timeCurrent, state.timeTotal, state.title, state.uiOffsetY, state.uiScale, state.vignette, bgImage, CANVAS_W, CANVAS_H]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    document.fonts.ready.then(() => requestAnimationFrame(renderCanvas));
  }, [renderCanvas, CANVAS_W, CANVAS_H]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        setBgImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const exportImage = useCallback(() => {
    renderCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    const safeTitle = state.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "track";
    
    link.download = `${safeTitle}-aesthetic-wallpaper.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const toast = toastRef.current;
    if (toast) {
      toast.classList.remove("opacity-0", "translate-y-[-150%]");
      toast.classList.add("opacity-100", "translate-y-0");
      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-[-150%]");
        toast.classList.remove("opacity-100", "translate-y-0");
      }, 3000);
    }
  }, [renderCanvas, state.title]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleDragStart = (clientY: number) => {
      isDraggingRef.current = true;
      dragStartRef.current = { y: clientY, initialOffsetY: state.uiOffsetY };
      canvas.style.cursor = "grabbing";
    };

    const handleDragMove = (clientY: number) => {
      if (!isDraggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const displayScale = CANVAS_H / rect.height;
      const deltaY = (clientY - dragStartRef.current.y) * displayScale;
      const newY = Math.max(-950, Math.min(950, dragStartRef.current.initialOffsetY + deltaY));      
      setState(prevState => ({...prevState, uiOffsetY: newY}));
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    const handleMouseDown = (e: MouseEvent) => handleDragStart(e.clientY);
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => handleDragEnd();

    const handleTouchStart = (e: TouchEvent) => handleDragStart(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        if (e.cancelable) e.preventDefault();
        handleDragMove(e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => handleDragEnd();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setState(prevState => {
        const scaleChange = e.deltaY > 0 ? -0.04 : 0.04;
        return {...prevState, uiScale: Math.round(Math.max(0.4, Math.min(1.6, prevState.uiScale + scaleChange)) * 100) / 100};
      });
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [CANVAS_H]);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#0b0b0f] text-[#f3f4f6]">
      <style>{`
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #ffffff; cursor: pointer; margin-top: -6px; box-shadow: 0 2px 6px rgba(0,0,0,0.4); border: 2px solid #1a1a24; transition: transform 0.1s ease, background-color 0.1s ease; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); background-color: #f3f4f6; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; background: #1e1e28; border-radius: 3px; }
        input[type=range]:focus { outline: none; }
        .preview-container { background-image: linear-gradient(45deg, #121216 25%, transparent 25%), linear-gradient(-45deg, #121216 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #121216 75%), linear-gradient(-45deg, transparent 75%, #121216 75%); background-size: 24px 24px; background-position: 0 0, 0 12px, 12px -12px, -12px 0px; }
        .glass-sidebar { background: rgba(18, 18, 24, 0.85); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
      {/* Sidebar Controls */}
      <div className="w-full md:w-105 bg-[#121216] h-1/2 md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#1e1e28] shrink-0 flex flex-col z-10">
        <div className="p-6 space-y-8 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">AESTHETIC STORY MAKER</h1>
              <p className="text-[11px] text-gray-400 mt-0.5 tracking-wider font-semibold uppercase">by Poet ni Luiese</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Background Wallpaper</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="imageInput" className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-[#2d2d39] rounded-xl cursor-pointer bg-[#171721] hover:bg-[#1c1c28] hover:border-gray-500 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-4 pb-4 text-gray-400">
                  <svg className="w-6 h-6 mb-2 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-xs font-semibold text-gray-300">Click to upload photo</p>
                </div>
                <input id="imageInput" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Track Metadata</label>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] text-gray-500 font-bold uppercase">Song</span>
                <input type="text" value={state.title} className="w-full bg-[#171721] border border-[#2d2d39] rounded-lg pl-14 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition duration-200" onChange={(e) => updateState(setState, "title", e.currentTarget.value)} />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] text-gray-500 font-bold uppercase">Artist</span>
                <input type="text" value={state.artist} className="w-full bg-[#171721] border border-[#2d2d39] rounded-lg pl-14 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition duration-200" onChange={(e) => updateState(setState, "artist", e.currentTarget.value)} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Start Timestamp</label>
                  <input type="text" value={state.timeCurrent} className="w-full bg-[#171721] border border-[#2d2d39] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white transition" onChange={(e) => updateState(setState, "timeCurrent", e.currentTarget.value)} />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">End Timestamp</label>
                  <input type="text" value={state.timeTotal} className="w-full bg-[#171721] border border-[#2d2d39] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white transition" onChange={(e) => updateState(setState, "timeTotal", e.currentTarget.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-[#171721] p-4 rounded-xl border border-[#2d2d39]/50">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">Visible Elements</label>
            {VISIBLE_ELEMENTS.map((element) => (
              <div key={element.key} className="flex items-center justify-between p-2 bg-[#121216] rounded-lg px-3">
                <span className="text-xs text-gray-300 font-medium">{element.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={state[element.key] as boolean} className="sr-only peer" onChange={(e) => updateState(setState, element.key, e.target.checked)} />
                  <div className="w-9 h-5 bg-[#2d2d39] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#121216] peer-checked:after:border-[#121216]"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-5 bg-[#171721] p-4 rounded-xl border border-[#2d2d39]/50">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Movable Controls</label>
              <span className="text-[9px] text-gray-500 bg-[#2d2d39] px-2 py-0.5 rounded-full uppercase">Interactive</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>Vertical Offset</span>
                <span className="font-bold text-white">{Math.round(state.uiOffsetY)}</span>
              </div>
              <input type="range" min="-1000" max="1000" value={state.uiOffsetY} step="5" onChange={(e) => updateState(setState, "uiOffsetY", parseInt(e.currentTarget.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path></svg>UI Size (Scale)</span>
                <span className="font-bold text-white">{state.uiScale.toFixed(2)}x</span>
              </div>
              <input type="range" min="0.4" max="1.6" value={state.uiScale} step="0.01" onChange={(e) => updateState(setState, "uiScale", parseFloat(e.currentTarget.value))} />
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Image Filters & Lighting</label>
            {FILTERS.map((filter) => (
              <div key={filter.key}>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{filter.label}</span>
                  <span className="font-semibold text-white">{state[filter.key]}</span>
                </div>
                <input type="range" min={filter.min} max={filter.max} value={state[filter.key] as number} step={filter.step} onChange={(e) => updateState(setState, filter.key, parseFloat(e.currentTarget.value))} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#0c0c0f] border-t border-[#1e1e28] space-y-5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Export Size</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAspectRatio(key as AspectRatio)}
                  className={`p-3 text-center rounded-lg border text-xs font-semibold transition-all duration-200 ${
                    aspectRatio === key ? "bg-white text-black border-white" : "bg-transparent border-[#2d2d39] text-gray-300 hover:border-gray-500 hover:bg-white/5"
                  }`}
                >{label} ({key})</button>
              ))}
            </div>
          </div>
          <button onClick={exportImage} className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-200 active:scale-95 transition-all duration-200 flex justify-center items-center gap-2 shadow-lg shadow-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export HD Wallpaper
          </button>
        </div>
      </div>

      {/* Live Preview Canvas Panel */}
      <div className="flex-1 h-1/2 md:h-full preview-container flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-gray-300 pointer-events-none hidden md:block select-none shadow-md">
          💡 Drag inside preview to move music interface • Scroll wheel to resize
        </div>
        <div className="relative w-full max-w-107.5 shadow-[0_30px_70px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden bg-black ring-1 ring-white/15" style={{ aspectRatio: aspectRatio.replace(":", " / ") }}>
          <canvas ref={canvasRef} className="w-full h-full object-contain"></canvas>
        </div>
        <div ref={toastRef} className="absolute top-6 right-6 bg-white text-black font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl transform transition-all duration-300 translate-y-[-150%] opacity-0 z-50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          Wallpaper saved successfully!
        </div>
      </div>
    </div>
  );
}