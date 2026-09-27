const GOLD = "#C9A96E";
const GRAY = "#9CA3AF";

function LeftArt() {
  return (
    <svg
      viewBox="0 0 200 1200"
      preserveAspectRatio="xMidYMin meet"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leftFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5EFE0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5EFE0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="1200" fill="url(#leftFade)" />

      {/* Тақта (chalkboard) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.28">
        <rect x="35" y="70" width="130" height="92" rx="6" />
        <line x1="70" y1="162" x2="60" y2="196" />
        <line x1="130" y1="162" x2="140" y2="196" />
        <text x="52" y="105" fontSize="22" fill="none" stroke={GOLD} strokeWidth="1.2">
          x²+y²
        </text>
        <text x="58" y="135" fontSize="22" fill="none" stroke={GOLD} strokeWidth="1.2">
          π ≈ 3.14
        </text>
        <line x1="50" y1="145" x2="150" y2="145" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Кітап дестесі (stack of books) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.22">
        <rect x="40" y="300" width="120" height="18" rx="2" />
        <rect x="48" y="318" width="110" height="18" rx="2" />
        <rect x="42" y="336" width="118" height="18" rx="2" />
        <line x1="60" y1="300" x2="60" y2="318" />
        <line x1="130" y1="318" x2="130" y2="336" />
      </g>

      {/* Глобус (globe) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.25">
        <circle cx="100" cy="470" r="55" />
        <ellipse cx="100" cy="470" rx="55" ry="22" />
        <ellipse cx="100" cy="470" rx="22" ry="55" />
        <line x1="45" y1="470" x2="155" y2="470" />
        <line x1="100" y1="540" x2="100" y2="585" />
        <line x1="70" y1="585" x2="130" y2="585" />
      </g>

      {/* Үстел шамы (desk lamp) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.22">
        <line x1="100" y1="700" x2="100" y2="655" />
        <path d="M70 655 Q100 630 130 655" />
        <line x1="65" y1="700" x2="135" y2="700" />
        <line x1="100" y1="700" x2="100" y2="740" />
        <line x1="75" y1="740" x2="125" y2="740" />
      </g>

      {/* Қарындаш пен сызғыш (pencil + ruler) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.2">
        <line x1="55" y1="840" x2="145" y2="880" />
        <path d="M145 880 L158 886 L150 895 Z" />
        <rect x="55" y="920" width="110" height="14" rx="2" transform="rotate(-6 55 920)" />
      </g>

      {/* Кітап (ашық) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.2">
        <path d="M45 1010 Q100 990 155 1010 L155 1055 Q100 1035 45 1055 Z" />
        <line x1="100" y1="998" x2="100" y2="1043" />
      </g>
    </svg>
  );
}

function RightArt() {
  return (
    <svg
      viewBox="0 0 200 1200"
      preserveAspectRatio="xMidYMin meet"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rightFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5EFE0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5EFE0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="1200" fill="url(#rightFade)" />

      {/* Сынып терезесі (window) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.26">
        <rect x="45" y="70" width="110" height="130" rx="4" />
        <line x1="100" y1="70" x2="100" y2="200" />
        <line x1="45" y1="135" x2="155" y2="135" />
        <path d="M55 70 Q100 40 145 70" />
      </g>

      {/* Мектеп қоңырауы (school bell) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.22">
        <path d="M75 300 Q75 260 100 260 Q125 260 125 300 L133 330 L67 330 Z" />
        <line x1="100" y1="245" x2="100" y2="260" />
        <circle cx="100" cy="240" r="6" />
        <circle cx="100" cy="340" r="5" />
      </g>

      {/* Парта (school desk) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.24">
        <rect x="40" y="430" width="120" height="14" rx="2" />
        <line x1="55" y1="444" x2="50" y2="500" />
        <line x1="145" y1="444" x2="150" y2="500" />
        <rect x="55" y="465" width="90" height="10" rx="1" opacity="0.7" />
      </g>

      {/* Қарындаштар шоғыры (pencil cup) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.22">
        <path d="M60 620 L65 690 L135 690 L140 620 Z" />
        <line x1="75" y1="620" x2="70" y2="560" />
        <line x1="100" y1="620" x2="100" y2="545" />
        <line x1="125" y1="620" x2="130" y2="565" />
      </g>

      {/* Кактус ыдыста (potted plant) */}
      <g stroke={GOLD} strokeWidth="1.5" opacity="0.22">
        <path d="M70 830 Q60 780 85 760 Q90 800 85 830" />
        <path d="M110 840 Q125 795 105 770 Q98 810 105 840" />
        <path d="M65 840 L135 840 L128 890 L72 890 Z" />
      </g>

      {/* Дәптер (notebook) */}
      <g stroke={GRAY} strokeWidth="1.5" opacity="0.2">
        <rect x="55" y="970" width="90" height="120" rx="4" />
        <line x1="55" y1="995" x2="145" y2="995" />
        <line x1="70" y1="1020" x2="130" y2="1020" />
        <line x1="70" y1="1040" x2="130" y2="1040" />
        <line x1="70" y1="1060" x2="115" y2="1060" />
      </g>
    </svg>
  );
}

export default function SideDecoration({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`hidden xl:block absolute top-0 ${
        side === "left" ? "left-0" : "right-0"
      } w-[200px] h-full pointer-events-none z-0`}
    >
      {side === "left" ? <LeftArt /> : <RightArt />}
    </div>
  );
}
