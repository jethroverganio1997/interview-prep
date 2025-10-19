import * as React from 'react';

import { type SlateElementProps, SlateElement } from 'platejs/static';
import type { Alignment } from '@platejs/basic-styles';

import { alignmentClass } from '@/components/editor/ui/editor-utils';
import { cn } from '@/lib/utils';

export function BlockquoteElementStatic(props: SlateElementProps) {
  const align =
    (props.element as { align?: Alignment | null })?.align ?? null;
  const alignmentStyle: React.CSSProperties | undefined =
    align && align !== 'left' ? { textAlign: align } : undefined;

  return (
    <SlateElement
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
