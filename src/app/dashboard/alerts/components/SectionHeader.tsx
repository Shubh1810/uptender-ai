import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  small?: boolean;
}

export function SectionHeader({ icon: Icon, title, description, small = false }: Props) {
  return (
    <div className={`flex items-start gap-3 ${small ? 'mb-2' : 'mb-6'}`}>
      
      <div
        className="
          h-9 w-9
          flex items-center justify-center
          rounded-lg
          bg-neutral-100
          text-neutral-700
          flex-shrink-0
        "
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex flex-col">
        <h2
          className={`
            font-semibold text-neutral-900
            ${small ? 'text-base' : 'text-xl'}
          `}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`
              text-neutral-600
              ${small ? 'text-sm' : 'text-base'}
              mt-1
            `}
          >
            {description}
          </p>
        )}
      </div>

    </div>
  );
}