"use client";

import { IoLogoWhatsapp } from "react-icons/io5";

export default function WhatsAppFloating() {
  const handleClick = () => {
    window.open(
      "https://api.whatsapp.com/send/?phone=628895276116&text=Halo%2C+saya+tertarik+dengan+undangan+digitalnya.%0ABisa+saya+dapatkan+informasi+lebih+lanjut%3F&type=phone_number&app_absent=0",
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-green-500 p-3 shadow-md hover:bg-green-600 transition-colors"
      aria-label="Chat via WhatsApp"
    >
      <IoLogoWhatsapp className="h-5 w-5 text-white" />
    </button>
  );
}
