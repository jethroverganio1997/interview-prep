'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      data-type="fixed-toolbar"
      {...props}
      className={cn(
        'plate-toolbar sticky top-0 left-0 z-40 scrollbar-hide w-full justify-center overflow-x-auto rounded-t-lg border-b border-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60',
        props.className
      )}
    />
  );
}
