import React from 'react';
import { NavLink } from 'react-router';
import { icons } from 'lucide-react';
import { motion } from 'motion/react';
import { NAV_ITEMS } from '../../lib/constants';

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-surface/92 backdrop-blur-xl safe-bottom">
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons] as React.FC<{ size?: number; className?: string }> | undefined;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute top-0 inset-x-0 h-0.5 bg-accent rounded-b-full"
                    />
                  )}
                  {Icon && (
                    <Icon
                      size={20}
                      className={`transition-colors duration-200 ${isActive ? 'text-accent' : 'text-text-muted'}`}
                    />
                  )}
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
