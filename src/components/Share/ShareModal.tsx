import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Send } from 'lucide-react';
import { useTransit } from '../../context/TransitContext';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const { t } = useTransit();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = data.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${data.title}\n${data.text}\n\nCheck on Delhi Yatra:\n${data.url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url
        });
        onClose();
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E5EAF0]">
        {/* Header */}
        <div className="bg-[#063B73] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EA580C] flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{t.share}</h3>
              <p className="text-[11px] text-blue-200">Delhi Yatra Transit Share</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-[#F6F8FB] border border-[#E5EAF0] p-3.5 rounded-xl">
            <h4 className="font-bold text-xs text-[#172033]">{data.title}</h4>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{data.text}</p>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>Native Share</span>
              </button>
            ) : (
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.copiedLink : 'Copy Link'}</span>
              </button>
            )}
          </div>

          {/* Copy link bar */}
          <div className="pt-2 border-t border-[#E5EAF0]">
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5">
              Direct Shareable Link
            </label>
            <div className="flex items-center gap-2 bg-[#F6F8FB] border border-[#E5EAF0] rounded-lg p-1.5">
              <input
                type="text"
                readOnly
                value={data.url}
                className="flex-1 bg-transparent text-xs text-[#172033] font-mono px-2 focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-[#1D4ED8] border border-[#E5EAF0] rounded-md transition cursor-pointer shrink-0"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F6F8FB] px-5 py-3 border-t border-[#E5EAF0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
