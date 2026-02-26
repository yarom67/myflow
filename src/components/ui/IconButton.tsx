import type { ReactNode } from 'react';
import { motion } from 'motion/react';

type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  size?: IconButtonSize;
  className?: string;
  tooltip?: string;
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function IconButton({
  icon,
  onClick,
  size = 'md',
  className = '',
  tooltip,
}: IconButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={tooltip}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        inline-flex items-center justify-center rounded-full
        bg-surface border border-border
        text-text-secondary
        hover:bg-surface-hover hover:text-text-primary hover:border-border-strong
        transition-colors duration-200
        cursor-pointer
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon}
    </motion.button>
  );
}
