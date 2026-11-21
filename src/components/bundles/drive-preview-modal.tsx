"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  HardDrive,
  Folder,
  FileVideo,
  FileMusic,
  FileText,
  Play,
  Pause,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCurrency } from "@/context/currency-context";

interface DrivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUnlock: (product: Product) => void;
}

export function DrivePreviewModal({
  isOpen,
  onClose,
  product,
  onUnlock,
}: DrivePreviewModalProps) {
  const { formatPrice: formatCurr } = useCurrency();
  const [activeVideoPreview, setActiveVideoPreview] = useState<string>(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    overlays: true,
    luts: true,
    sfx: false,
  });

  if (!isOpen || !product) return null;

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const sampleDriveTree = [
    {
      id: "overlays",
      name: "01_Cinematic_4K_Overlays (42 items • 18.2 GB)",
      files: [
        { name: "4K_16mm_Film_Grain_Master.mov", size: "480 MB", preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4" },
        { name: "Vintage_Light_Leak_Warm_03.mov", size: "320 MB", preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
        { name: "Anamorphic_Blue_Lens_Flare_4K.mov", size: "510 MB", preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
        { name: "Retro_Dust_And_Scratches_Loop.mov", size: "290 MB", preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
      ],
    },
    {
      id: "luts",
      name: "02_Color_Grading_LUTs (65 .cube files • 220 MB)",
      files: [
        { name: "BADARSH_Moody_Teal_Orange.cube", size: "3.2 MB" },
        { name: "Kodak_Portra_400_Warm_Glow.cube", size: "3.2 MB" },
        { name: "Fuji_Pro_400H_Skin_Clean.cube", size: "3.2 MB" },
        { name: "Cinematic_Noir_High_Contrast.cube", size: "3.2 MB" },
      ],
    },
    {
      id: "sfx",
      name: "03_Sound_Design_Master_WAV (350 files • 4.1 GB)",
      files: [
        { name: "Deep_Cinematic_Sub_Impact_01.wav", size: "12 MB" },
        { name: "Fast_Velocity_Whoosh_Transition.wav", size: "6 MB" },
        { name: "Riser_Tension_Builder_Long.wav", size: "18 MB" },
        { name: "Atmospheric_Ambient_Drone_Bed.wav", size: "24 MB" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-bold">
              <HardDrive className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold">
                  GOOGLE DRIVE CLOUD PREVIEW
                </span>
                <span className="text-xs text-neutral-400">• Full Folder Tree Verified</span>
              </div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">
                {product.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onUnlock(product)}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2 text-xs font-bold shadow-md hover:scale-102 transition-transform"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Get Full Cloud Vault ({formatCurr(product.price)})</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split Screen (Drive Tree Explorer Left + 4K Video Preview Right) */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Google Drive File Explorer */}
          <div className="w-full lg:w-1/2 border-r border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Cloud Vault Contents ({product.fileSize || "100GB+"})
              </h4>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Direct Cloud Download
              </span>
            </div>

            {/* Folder Structure */}
            <div className="space-y-3">
              {sampleDriveTree.map((folder) => {
                const isExpanded = expandedFolders[folder.id];
                return (
                  <div
                    key={folder.id}
                    className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="w-full flex items-center justify-between p-3.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Folder className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {folder.name}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-2">
                        {folder.files.map((file: any, fIdx) => (
                          <div
                            key={fIdx}
                            onClick={() => {
                              if (file.preview) {
                                setActiveVideoPreview(file.preview);
                                setIsPlaying(true);
                              }
                            }}
                            className={`flex items-center justify-between rounded-xl p-2 text-xs transition-colors cursor-pointer ${
                              file.preview && activeVideoPreview === file.preview
                                ? "bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {file.preview ? (
                                <FileVideo className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                              )}
                              <span className="truncate font-mono text-[11px]">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-neutral-400">{file.size}</span>
                              {file.preview && (
                                <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                                  ▶ Watch
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Delivery Guarantee Card */}
            <div className="mt-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 p-4 text-xs leading-relaxed">
              <span className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                <ShieldCheck className="h-4 w-4" /> Google Drive High-Speed Infrastructure
              </span>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400 text-[11px]">
                Upon purchase, you immediately receive a personal Google Drive invitation and private download link. You can stream, preview, or bulk-download files at your maximum ISP bandwidth without throttled servers.
              </p>
            </div>
          </div>

          {/* Right Column: 4K Video Preview Player */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-neutral-950 text-white">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Live 4K Overlay Preview
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                  60 FPS • ProRes Compatible
                </span>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                <video
                  src={activeVideoPreview}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/70 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-white">
                  PREVIEW: {activeVideoPreview.split("/").pop()}
                </div>
              </div>

              {/* Feature Chips */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="font-bold text-white text-[11px] block">Drag &amp; Drop Simplicity</span>
                  <span className="text-[10px] text-neutral-400">Set blend mode to Screen or Overlay in Premiere / FCPX / CapCut</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="font-bold text-white text-[11px] block">Alpha Transparency</span>
                  <span className="text-[10px] text-neutral-400">Zero render overhead; clean transparency channels pre-baked</span>
                </div>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold">Total Vault Access</span>
                <div className="text-xl font-bold text-white">
                  {formatCurr(product.price)}
                </div>
              </div>
              <button
                onClick={() => onUnlock(product)}
                className="flex items-center gap-2 rounded-xl bg-white text-neutral-900 px-6 py-3 text-xs font-bold shadow-xl hover:scale-102 transition-transform"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Instant Cloud Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
