'use client';

import * as React from 'react';

import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  MinusIcon,
  QuoteIcon,
  UnderlineIcon,
} from 'lucide-react';
import { Editor, Transforms } from 'slate';
import type { Node } from 'slate';
import { useEditorReadOnly, useEditorRef } from 'platejs/react';

import { AlignToolbarButton } from '@/components/editor/ui/align-toolbar-button';
import { BlockToolbarButton } from '@/components/editor/ui/block-toolbar-button';
import { ExportToolbarButton } from '@/components/editor/ui/export-toolbar-button';
import { ImportToolbarButton } from '@/components/editor/ui/import-toolbar-button';
import { MarkToolbarButton } from '@/components/editor/ui/mark-toolbar-button';
import { LineHeightToolbarButton } from '@/components/editor/ui/line-height-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
} from '@/components/editor/ui/list-toolbar-button';
import { FontSizeToolbarButton } from '@/components/editor/ui/font-size-toolbar-button';
import { TurnIntoToolbarButton } from '@/components/editor/ui/turn-into-toolbar-button';
import { ToolbarButton, ToolbarGroup } from '@/components/editor/ui/toolbar';

export function FixedToolbarButtons() {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  const handleInsertDivider = React.useCallback(() => {
    if (!editor || readOnly) return;

    const slateEditor = editor as unknown as Editor;

    const dividerNode = {
      type: 'hr',
      children: [{ text: '' }],
    };

    const paragraphNode = {
      type: 'p',
      children: [{ text: '' }],
    };

    Transforms.insertNodes(slateEditor, dividerNode as unknown as Node);
    Transforms.insertNodes(slateEditor, paragraphNode as unknown as Node);
  }, [editor, readOnly]);

  const handleMouseDown = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  return (
    <div className="flex w-full items-center justify-center overflow-x-auto scrollbar-hide">
      <ToolbarGroup>
        <ImportToolbarButton />
        <ExportToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <AlignToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <FontSizeToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <LineHeightToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <TurnIntoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkToolbarButton disabled={readOnly} nodeType="bold" tooltip="Bold (Cmd+B)">
          <BoldIcon />
        </MarkToolbarButton>
        <MarkToolbarButton
          disabled={readOnly}
          nodeType="italic"
          tooltip="Italic (Cmd+I)"
        >
          <ItalicIcon />
        </MarkToolbarButton>
        <MarkToolbarButton
          disabled={readOnly}
          nodeType="underline"
          tooltip="Underline (Cmd+U)"
        >
          <UnderlineIcon />
        </MarkToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <BlockToolbarButton tooltip="Heading 1" blockType="h1">
          <Heading1Icon />
        </BlockToolbarButton>
        <BlockToolbarButton tooltip="Heading 2" blockType="h2">
          <Heading2Icon />
        </BlockToolbarButton>
        <BlockToolbarButton tooltip="Blockquote" blockType="blockquote">
          <QuoteIcon />
        </BlockToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <BulletedListToolbarButton />
        <NumberedListToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          disabled={readOnly}
          onClick={handleInsertDivider}
          onMouseDown={handleMouseDown}
          tooltip="Insert divider"
        >
          <MinusIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}
