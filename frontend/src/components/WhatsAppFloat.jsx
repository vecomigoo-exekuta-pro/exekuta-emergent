import { motion } from "framer-motion";
import { useSiteData } from "@/cms/CmsContext";

export default function WhatsAppFloat() {
  const { footer } = useSiteData();
  return (
    <motion.a
      href={footer.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-button"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group fixed bottom-[5.75rem] right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-acid text-ink shadow-[0_8px_32px_rgba(183,255,0,0.35)] transition-transform duration-300 hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-acid/40 [animation-duration:2.5s]" />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2 22l4.9-1.6A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.2-3 .9.9-2.9-.2-.3a8.1 8.1 0 0 1 6.7-12.6zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.1l-1 1.2c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.5-1 .1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.6-.7-.6h-.5z" />
      </svg>
    </motion.a>
  );
}
