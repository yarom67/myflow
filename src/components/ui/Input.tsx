import type { ChangeEvent, ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number' | 'date';
  className?: string;
  icon?: ComponentType<LucideProps>;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  icon: Icon,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute top-1/2 -translate-y-1/2 start-3 text-text-muted pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-surface text-text-primary placeholder:text-text-muted
            shadow-card rounded-xl
            px-3 py-2.5 text-sm
            outline-none
            transition-all duration-200
            focus:shadow-[0_0_0_2px_rgba(109,40,217,0.25),0_1px_3px_rgba(0,0,0,0.05)]
            ${Icon ? 'ps-10' : ''}
          `}
        />
      </div>
    </div>
  );
}
