import React from 'react';
import { NavLink } from 'react-router';
import { useUiStore } from '../../store/uiStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import { icons } from 'lucide-react';

interface SidebarLinkProps {
  path: string;
  label: string;
  icon: string;
}

export function SidebarLink({ path, label, icon }: SidebarLinkProps) {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const isMobile = useIsMobile();

  const IconComponent = icons[icon as keyof typeof icons] as React.FC<{ size?: number; className?: string }> | undefined;

  const showLabel = isMobile || !sidebarCollapsed;

  return (
    <NavLink
      to={path}
      end={path === '/'}
      onClick={isMobile ? closeMobileMenu : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive
          ? 'bg-accent text-white shadow-[0_2px_8px_rgba(109,40,217,0.25)]'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
        }`
      }
    >
      {({ isActive: _isActive }) => (
        <>
          {IconComponent && (
            <IconComponent
              size={18}
              className="shrink-0"
            />
          )}
          {showLabel && (
            <span className="whitespace-nowrap text-sm font-medium">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
