import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const FlipIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 4v15m0-15L4.5 7.5M8 4l3.5 3.5M16 20V5m0 15-3.5-3.5M16 20l3.5-3.5" />
  </Icon>
);

export const RateIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8.5h15m0 0L15.5 5M19 8.5 15.5 12M20 15.5H5m0 0L8.5 12M5 15.5 8.5 19" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 6.5l11 11m0-11-11 11" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v9.5m0 4.5v.01" />
  </Icon>
);

export const LogoMark = (props: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
    <rect width="24" height="24" fill="currentColor" />
    <path
      d="M7.5 9.5h9l-2.5-2.5M16.5 14.5h-9l2.5 2.5"
      stroke="var(--accent-ink)"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);
