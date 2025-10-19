import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';
import type { Alignment } from '@platejs/basic-styles';

import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';
import { alignmentClass } from '@/components/editor/ui/editor-utils';

export function ParagraphElementStatic(props: SlateElementProps) {
  const align =
    (props.element as { align?: Alignment | null })?.align ?? null;
  const alignmentStyle: React.CSSProperties | undefined =
    align && align !== 'left' ? { textAlign: align } : undefined;

  return (
    <SlateElement
      {...props}
      style={{
        ...(props.style as React.CSSProperties | undefined),
        ...alignmentStyle,
      }}
      className={cn('m-0 px-0 py-1', alignmentClass(align))}
    >
      {props.children}
    </SlateElement>
  );
}
