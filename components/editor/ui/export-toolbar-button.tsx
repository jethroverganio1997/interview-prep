'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { MarkdownPlugin } from '@platejs/markdown';
import { ArrowDownToLineIcon } from 'lucide-react';
import { createSlateEditor } from 'platejs';
import { useEditorRef } from 'platejs/react';
import { serializeHtml } from 'platejs/static';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditorStatic } from '@/components/editor/ui/editor-static';
import { ToolbarButton } from '@/components/editor/ui/toolbar';
import { BaseBasicBlocksKit } from '@/components/editor/plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/components/editor/plugins/basic-marks-base-kit';

const BaseEditorKit = [...BaseBasicBlocksKit, ...BaseBasicMarksKit];
const SITE_URL = 'https://platejs.org';

async function downloadBlobUrl(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadDataUrl(dataUrl: string, filename: string) {
  await downloadBlobUrl(dataUrl, filename);
}

export function ExportToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const disabled = !editor;

  const getCanvas = React.useCallback(async () => {
    if (!editor) return null;

    const { default: html2canvas } = await import('html2canvas-pro');

    const canvas = await html2canvas(editor.api.toDOMNode(editor)!, {
      backgroundColor: '#ffffff',
      onclone: (documentClone: Document) => {
        documentClone.documentElement.classList.remove('dark');
        documentClone.body.classList.remove('dark');
        documentClone.documentElement.style.setProperty('color-scheme', 'light');
        documentClone.body.style.backgroundColor = '#ffffff';
        documentClone.body.style.color = '#111111';

        const editable = documentClone.querySelector('[contenteditable="true"]');
        if (!editable) return;

        editable
          .querySelectorAll<HTMLElement>('*')
          .forEach((element) => {
            element.style.fontFamily =
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
          });
      },
    });

    return canvas;
  }, [editor]);

  const exportToPdf = React.useCallback(async () => {
    const canvas = await getCanvas();
    if (!canvas) return;

    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const image = await pdfDoc.embedPng(canvas.toDataURL('image/png'));
    page.drawImage(image, {
      height: canvas.height,
      width: canvas.width,
      x: 0,
      y: 0,
    });
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });
    await downloadDataUrl(pdfBase64, 'editor.pdf');
  }, [getCanvas]);

  const exportToImage = React.useCallback(async () => {
    const canvas = await getCanvas();
    if (!canvas) return;

    await downloadDataUrl(canvas.toDataURL('image/png'), 'editor.png');
  }, [getCanvas]);

  const exportToHtml = React.useCallback(async () => {
    if (!editor) return;

    const staticEditor = createSlateEditor({
      plugins: BaseEditorKit,
      value: editor.children,
    });

    const html = await serializeHtml(staticEditor, {
      editorComponent: EditorStatic,
      props: {
        style: { padding: '0 calc(50% - 350px)', paddingBottom: '0' },
      },
    });

    const tailwindCss = `<link rel="stylesheet" href="${SITE_URL}/tailwind.css">`;
    const katexCss =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">';

    const documentHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
      rel="stylesheet"
    />
    ${tailwindCss}
    ${katexCss}
    <style>
      :root {
        --font-sans: 'Inter', 'Inter Fallback';
        --font-mono: 'JetBrains Mono', 'JetBrains Mono Fallback';
        color-scheme: light;
      }

      body {
        background: #ffffff;
        color: #111111;
      }
    </style>
  </head>
  <body data-theme="light" class="">
    ${html}
  </body>
</html>`;

    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(documentHtml)}`;
    await downloadDataUrl(dataUrl, 'editor.html');
  }, [editor]);

  const exportToMarkdown = React.useCallback(async () => {
    if (!editor) return;
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize();
    const dataUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
    await downloadDataUrl(dataUrl, 'editor.md');
  }, [editor]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Export" isDropdown disabled={disabled}>
          <ArrowDownToLineIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={exportToHtml}>Export as HTML</DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToPdf}>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToImage}>Export as Image</DropdownMenuItem>
          <DropdownMenuItem onSelect={exportToMarkdown}>
            Export as Markdown
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
