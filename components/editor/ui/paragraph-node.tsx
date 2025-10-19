'use client';

import * as React from 'react';

import type { PlateElementProps } from 'platejs/react';
import type { Alignment } from '@platejs/basic-styles';

import { PlateElement } from 'platejs/react';

import { cn } from '@/lib/utils';
import { alignmentClass } from '@/components/editor/ui/editor-utils';

export function ParagraphElement(props: PlateElementProps) {
  const align =
    (props.element as { align?: Alignment | null })?.align ?? null;
  const alignmentStyle: React.CSSProperties | undefined =
    align && align !== 'left' ? { textAlign: align } : undefined;

  return (
    <PlateElement
      {...props}
      style={{
        ...(props.style as React.CSSProperties | undefined),
        ...alignmentStyle,
      }}
      className={cn('m-0 px-0 py-1', alignmentClass(align))}
    >
      {props.children}
    </PlateElement>
  );
}
