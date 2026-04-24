import type { IconProps } from './types';

export function CurrencyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
        fill={color}
      />
      <path
        d="M12.5 7H11V9H9V11H11V13H9V15H11V17H12.5V15H13.5C14.6 15 15.5 14.1 15.5 13C15.5 12.2 15.1 11.5 14.5 11.2C15.1 10.9 15.5 10.2 15.5 9.5C15.5 8.4 14.6 7.5 13.5 7.5H12.5V7ZM12.5 9H13.5C13.8 9 14 9.2 14 9.5C14 9.8 13.8 10 13.5 10H12.5V9ZM12.5 13V12H13.5C13.8 12 14 12.2 14 12.5C14 12.8 13.8 13 13.5 13H12.5Z"
        fill={color}
      />
    </svg>
  );
}
