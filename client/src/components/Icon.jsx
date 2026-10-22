// Small inline icon set (stroke icons, 24px grid) so there are no icon-font dependencies.
const paths = {
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin: <><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></>,
  phone: <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5L20 7" />,
  truck: <><path d="M2 6h11v10H2zM13 10h4l4 4v2h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />,
  tag: <><path d="M3 12V3h9l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z" />,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="13" r=".8" /><circle cx="16.5" cy="13" r=".8" /></>,
  align: <><path d="M12 3v18" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /></>,
  balance: <><path d="M12 3v18M5 21h14M5 7h14" /><path d="m5 7-3 6h6L5 7ZM19 7l-3 6h6l-3-6Z" /></>,
  rotate: <><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v5h-5" /></>,
  puncture: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  brake: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M5 7a9 9 0 0 1 3-3" /></>,
  battery: <><rect x="3" y="7" width="16" height="11" rx="2" /><path d="M21 11v3M7 12.5h4M9 10.5v4" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
};

export default function Icon({ name, size = 20, className = '', fill = 'none', ...rest }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
