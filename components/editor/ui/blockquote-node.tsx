'use client';

import * as React from 'react';

import { type PlateElementProps, PlateElement } from 'platejs/react';
import type { Alignment } from '@platejs/basic-styles';

import { alignmentClass } from '@/components/editor/ui/editor-utils';
import { cn } from '@/lib/utils';

export function BlockquoteElement(props: PlateElementProps) {
  const align =
    (props.element as { align?: Alignment | null })?.align ?? null;
  const alignmentStyle: React.CSSProperties | undefined =
    align && align !== 'left' ? { textAlign: align } : undefined;

  return (
    <PlateElement
      as="blockquote"
      style={{
        ...(props.style as React.CSSProperties | undefined),
        ...alignmentStyle,
      }}
      className={cn('my-1 border-l-2 pl-6 italic', alignmentClass(align))}
      {...props}
    />
  );
}
