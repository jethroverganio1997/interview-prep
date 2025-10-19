'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { MarkdownPlugin } from '@platejs/markdown';
import { ArrowUpToLineIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';
import { getEditorDOMFromHtmlString } from 'platejs/static';
import { useFilePicker } from 'use-file-picker';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolbarButton } from '@/components/editor/ui/toolbar';

type ImportType = 'html' | 'markdown';

type FileSelection =
  | {
      plainFiles: File[];
      errors?: undefined;
    }
  | {
      plainFiles?: undefined;
      errors: unknown[];
    };

export function ImportToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const getFileNodes = React.useCallback(
    (text: string, type: ImportType) => {
      if (!editor) return [];

      if (type === 'html') {
        const editorNode = getEditorDOMFromHtmlString(text);
        return editor.api.html.deserialize({ element: editorNode });
      }

      if (type === 'markdown') {
        return editor.getApi(MarkdownPlugin).markdown.deserialize(text);
      }

      return [];
    },
    [editor]
  );

  const { openFilePicker: openMarkdownPicker } = useFilePicker({
    accept: ['.md', '.mdx'],
    multiple: false,
    onFilesSelected: async (selection: FileSelection) => {
      if (!editor) return;
      if ('errors' in selection) return;
      const files = selection.plainFiles;
      if (!files?.length) return;
      const text = await files[0].text();
      const nodes = getFileNodes(text, 'markdown');
      editor.tf.insertNodes(nodes);
    },
  });

  const { openFilePicker: openHtmlPicker } = useFilePicker({
    accept: ['text/html'],
    multiple: false,
    onFilesSelected: async (selection: FileSelection) => {
      if (!editor) return;
      if ('errors' in selection) return;
      const files = selection.plainFiles;
      if (!files?.length) return;
      const text = await files[0].text();
      const nodes = getFileNodes(text, 'html');
      editor.tf.insertNodes(nodes);
    },
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Import" isDropdown disabled={!editor}>
          <ArrowUpToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => {
              openHtmlPicker();
            }}
          >
            Import from HTML
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              openMarkdownPicker();
            }}
          >
            Import from Markdown
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
