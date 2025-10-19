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
    match: (node) =>
      SlateElement.isElement(node) && node.type === type && Editor.isBlock(editor, node),
  });

  return !!match;
}

function setBlockType(editor: Editor, type: string) {
  Transforms.setNodes(
    editor,
    { type },
    {
      match: (node) => SlateElement.isElement(node) && Editor.isBlock(editor, node),
      split: true,
    }
  );
}

export type BlockToolbarButtonProps = {
  type: string;
  tooltip?: string;
} & Omit<React.ComponentProps<typeof ToolbarButton>, 'onClick' | 'pressed'>;

export function BlockToolbarButton({
  children,
  className,
  tooltip,
  type,
  ...props
}: BlockToolbarButtonProps) {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const selection = useEditorSelection();

  const pressed = React.useMemo(() => {
    if (!editor || readOnly || !selection) return false;
    return isBlockActive(editor, type);
  }, [editor, readOnly, selection, type]);

  const handleClick = React.useCallback(() => {
    if (!editor || readOnly) return;
    const nextType = pressed ? DEFAULT_BLOCK_TYPE : type;
    setBlockType(editor, nextType);
  }, [editor, pressed, readOnly, type]);

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
