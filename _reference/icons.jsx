// Minimal icon set (lucide-style, strokeWidth controllable)
const Ic = ({ children, size = 24, stroke = 2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>{children}</svg>
);
const Plus = (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const Check = (p) => <Ic {...p}><path d="M20 6L9 17l-5-5"/></Ic>;
const ChevronLeft = (p) => <Ic {...p}><path d="M15 18l-6-6 6-6"/></Ic>;
const ChevronRight = (p) => <Ic {...p}><path d="M9 18l6-6-6-6"/></Ic>;
const Pill = (p) => <Ic {...p}><path d="M10.5 20.5a4.95 4.95 0 1 1-7-7l10-10a4.95 4.95 0 1 1 7 7l-10 10z"/><path d="M8.5 8.5l7 7"/></Ic>;
const Camera = (p) => <Ic {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Ic>;
const Bell = (p) => <Ic {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Ic>;
const BellOff = (p) => <Ic {...p}><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><path d="M1 1l22 22"/></Ic>;
const Trash = (p) => <Ic {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></Ic>;
const Edit = (p) => <Ic {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Ic>;
const Sun = (p) => <Ic {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Ic>;
const Moon = (p) => <Ic {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Ic>;
const Coffee = (p) => <Ic {...p}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></Ic>;
const Utensils = (p) => <Ic {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></Ic>;
const Clock = (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Ic>;
const AlertTri = (p) => <Ic {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></Ic>;
const Calendar = (p) => <Ic {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ic>;
const Droplet = (p) => <Ic {...p}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></Ic>;
const User = (p) => <Ic {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ic>;
const Volume = (p) => <Ic {...p}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></Ic>;
const Heart = (p) => <Ic {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Ic>;
const X = (p) => <Ic {...p}><path d="M18 6L6 18M6 6l12 12"/></Ic>;

Object.assign(window, {
  IcPlus: Plus, IcCheck: Check, IcChevronLeft: ChevronLeft, IcChevronRight: ChevronRight,
  IcPill: Pill, IcCamera: Camera, IcBell: Bell, IcBellOff: BellOff, IcTrash: Trash,
  IcEdit: Edit, IcSun: Sun, IcMoon: Moon, IcCoffee: Coffee, IcUtensils: Utensils,
  IcClock: Clock, IcAlert: AlertTri, IcCalendar: Calendar, IcDroplet: Droplet,
  IcUser: User, IcVolume: Volume, IcHeart: Heart, IcX: X,
});
