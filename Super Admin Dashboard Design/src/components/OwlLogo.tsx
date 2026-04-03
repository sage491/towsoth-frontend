export function OwlLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Owl head outline */}
      <path
        d="M16 4C11 4 8 7 6 11C5 13 4 16 4 19C4 23 6 26 9 27C10 27.5 11.5 28 13 28C13.5 28 14 27.8 14.5 27.5C15 27.2 15.5 27 16 27C16.5 27 17 27.2 17.5 27.5C18 27.8 18.5 28 19 28C20.5 28 22 27.5 23 27C26 26 28 23 28 19C28 16 27 13 26 11C24 7 21 4 16 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Left ear */}
      <path
        d="M6 11L4 8L6 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Right ear */}
      <path
        d="M26 11L28 8L26 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Left eye outer circle */}
      <circle
        cx="12"
        cy="16"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Left eye inner circle */}
      <circle
        cx="12"
        cy="16"
        r="1.5"
        fill="currentColor"
      />
      
      {/* Right eye outer circle */}
      <circle
        cx="20"
        cy="16"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Right eye inner circle */}
      <circle
        cx="20"
        cy="16"
        r="1.5"
        fill="currentColor"
      />
      
      {/* Beak */}
      <path
        d="M16 19L14 21L16 22L18 21L16 19Z"
        fill="currentColor"
      />
    </svg>
  );
}
