'use client';

import * as React from 'react';

import { Editor, Element as SlateElement, Transforms } from 'slate';
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelection,
} from 'platejs/react';

import { ToolbarButton } from '@/components/editor/ui/toolbar';

const DEFAULT_BLOCK_TYPE = 'p';

function isBlockActive(editor: Editor, type: string) {
  const [match] = Editor.nodes(editor, {
    match: (node) => {
      if (!SlateElement.isElement(node)) return false;
      if (!Editor.isBlock(editor, node)) return false;
      const element = node as SlateElement & { type?: string };
      return element.type === type;
    },
  });

  return !!match;
}

function setBlockType(editor: Editor, type: string) {
  Transforms.setNodes(
    editor,
    { type } as Partial<SlateElement>,
    {
      match: (node) => SlateElement.isElement(node) && Editor.isBlock(editor, node),
      split: true,
    }
  );
}

export type BlockToolbarButtonProps = {
  blockType: string;
  tooltip?: string;
} & Omit<React.ComponentProps<typeof ToolbarButton>, 'onClick' | 'pressed'>;

export function BlockToolbarButton({
  children,
  className,
  tooltip,
  blockType,
  ...props
}: BlockToolbarButtonProps) {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const selection = useEditorSelection();

  const pressed = React.useMemo(() => {
    if (!editor || readOnly || !selection) return false;
    return isBlockActive(editor as unknown as Editor, blockType);
  }, [editor, readOnly, selection, blockType]);

  const handleClick = React.useCallback(() => {
    if (!editor || readOnly) return;
    const nextType = pressed ? DEFAULT_BLOCK_TYPE : blockType;
    setBlockType(editor as unknown as Editor, nextType);
  }, [editor, pressed, readOnly, blockType]);

  const handleMouseDown = React.useCallback((event: React.MouseEvent) => {
    // Keep selection active while interacting with the toolbar.
    event.preventDefault();
  }, []);

  return (
    <ToolbarButton
      {...props}
      className={className}
      disabled={readOnly}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      pressed={pressed}
      tooltip={tooltip}
    >
      {children}
    </ToolbarButton>
  );
}
