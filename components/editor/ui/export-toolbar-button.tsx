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
import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { EditorStatic } from '@/components/editor/ui/editor-static';
import { ToolbarButton } from '@/components/editor/ui/toolbar';

const SITE_URL = 'https://platejs.org';

async function downloadFile(url: string, filename: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export function ExportToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const getCanvas = React.useCallback(async () => {
    if (!editor) return null;

    const { default: html2canvas } = await import('html2canvas-pro');

    const style = document.createElement('style');
    style.textContent = `
      :root { color-scheme: light; }
      body { background: #ffffff; color: #111111; }
    `;
    document.head.append(style);

    const editableNode = editor.api.toDOMNode(editor)!;
    const containerNode = editableNode.parentElement as HTMLElement | null;
    const toolbarNodes = Array.from(
      (containerNode ?? editableNode).querySelectorAll<HTMLElement>(
        '.plate-toolbar'
      )
    );

    const previousContainerStyle = containerNode
      ? {
          height: containerNode.style.height,
          maxHeight: containerNode.style.maxHeight,
          overflow: containerNode.style.overflow,
        }
      : null;
    const previousEditableStyle = {
      height: editableNode.style.height,
      maxHeight: editableNode.style.maxHeight,
      overflow: editableNode.style.overflow,
    };

    const previousToolbarDisplays = new Map<HTMLElement, string>();
    toolbarNodes.forEach((node) => {
      previousToolbarDisplays.set(node, node.style.display);
      node.style.display = 'none';
    });

    if (containerNode) {
      containerNode.style.height = 'auto';
      containerNode.style.maxHeight = 'none';
      containerNode.style.overflow = 'visible';
    }

    editableNode.style.height = 'auto';
    editableNode.style.maxHeight = 'none';
    editableNode.style.overflow = 'visible';

    const canvas = await html2canvas(containerNode ?? editableNode, {
      onclone: (documentClone: Document) => {
        const editable = documentClone.querySelector('[contenteditable="true"]');
        if (!editable) return;

        editable
          .querySelectorAll<HTMLElement>('*')
          .forEach((element) => {
            const existingStyle = element.getAttribute('style') || '';
            element.setAttribute(
              'style',
              `${existingStyle}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important`
            );
          });
      },
    });

    style.remove();

    toolbarNodes.forEach((node) => {
      const previous = previousToolbarDisplays.get(node);
      if (previous !== undefined) {
        node.style.display = previous;
      } else {
        node.style.display = '';
      }
    });

    if (containerNode && previousContainerStyle) {
      containerNode.style.height = previousContainerStyle.height;
      containerNode.style.maxHeight = previousContainerStyle.maxHeight;
      containerNode.style.overflow = previousContainerStyle.overflow;
    }

    editableNode.style.height = previousEditableStyle.height;
    editableNode.style.maxHeight = previousEditableStyle.maxHeight;
    editableNode.style.overflow = previousEditableStyle.overflow;

    return canvas;
  }, [editor]);

  const exportToPdf = React.useCallback(async () => {
    const canvas = await getCanvas();
    if (!canvas) return;

    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);
    const image = await pdfDoc.embedPng(canvas.toDataURL('PNG'));
    page.drawImage(image, {
      height: canvas.height,
      width: canvas.width,
      x: 0,
      y: 0,
    });
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

    await downloadFile(pdfBase64, 'editor.pdf');
  }, [getCanvas]);

  const exportToImage = React.useCallback(async () => {
    const canvas = await getCanvas();
    if (!canvas) return;

    await downloadFile(canvas.toDataURL('image/png'), 'editor.png');
  }, [getCanvas]);

  const exportToHtml = React.useCallback(async () => {
    if (!editor) return;

    const staticEditor = createSlateEditor({
      plugins: BaseEditorKit,
      value: editor.children,
    });

    const html = await serializeHtml(staticEditor, {
      editorComponent: EditorStatic,
      props: { style: { padding: '0 calc(50% - 350px)', paddingBottom: '' } },
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
      </head>
      <body>
        ${html}
      </body>
    </html>`;

    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(documentHtml)}`;
    await downloadFile(dataUrl, 'editor.html');
  }, [editor]);

  const exportToMarkdown = React.useCallback(async () => {
    if (!editor) return;
    const markdown = editor.getApi(MarkdownPlugin).markdown.serialize();
    const dataUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
    await downloadFile(dataUrl, 'editor.md');
  }, [editor]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Export" isDropdown>
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
