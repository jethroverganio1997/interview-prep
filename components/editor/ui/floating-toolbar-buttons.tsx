'use client';

import * as React from 'react';

import {
  BoldIcon,
  ItalicIcon,
  QuoteIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useEditorReadOnly } from 'platejs/react';

import { BlockToolbarButton } from '@/components/editor/ui/block-toolbar-button';
import { MarkToolbarButton } from '@/components/editor/ui/mark-toolbar-button';
import { ToolbarGroup } from '@/components/editor/ui/toolbar';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <ToolbarGroup>
        <MarkToolbarButton nodeType="bold" tooltip="Bold (Cmd+B)">
          <BoldIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (Cmd+I)">
          <ItalicIcon />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (Cmd+U)">
          <UnderlineIcon />
        </MarkToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <BlockToolbarButton tooltip="Blockquote" blockType="blockquote">
          <QuoteIcon />
        </BlockToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
