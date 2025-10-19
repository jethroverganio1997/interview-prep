'use client';

import * as React from 'react';

import type { TElement } from 'platejs';

import { toUnitLess } from '@platejs/basic-styles';
import { FontSizePlugin } from '@platejs/basic-styles/react';
import { Minus, Plus } from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorPlugin, useEditorSelector } from 'platejs/react';

import { cn } from '@/lib/utils';

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 96;
const DEFAULT_FONT_SIZE = 16;

const HEADING_FONT_SIZES: Record<string, number> = {
  h1: 36,
  h2: 24,
  h3: 20,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parseFontSize(value?: string): number | null {
  if (!value) return null;
  const unitLess = toUnitLess(value);
  const parsed = Number.parseInt(unitLess, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function FontSizeToolbarButton() {
  const { editor, tf } = useEditorPlugin(FontSizePlugin);

  const currentSize = useEditorSelector((valueEditor) => {
    const markSize = parseFontSize(
      valueEditor.api.marks()?.[KEYS.fontSize] as string | undefined
    );
    if (markSize) return clamp(markSize, MIN_FONT_SIZE, MAX_FONT_SIZE);

    const [block] = valueEditor.api.block<TElement>() || [];
    if (block?.type && HEADING_FONT_SIZES[block.type]) {
      return HEADING_FONT_SIZES[block.type];
    }

    return DEFAULT_FONT_SIZE;
  }, []);

  const [inputValue, setInputValue] = React.useState(
    currentSize.toString()
  );
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) {
      setInputValue(currentSize.toString());
    }
  }, [currentSize, hydrated]);

  const applyFontSize = React.useCallback(
    (nextSize: number) => {
      const clamped = clamp(Math.round(nextSize), MIN_FONT_SIZE, MAX_FONT_SIZE);
      tf.fontSize.addMark(`${clamped}px`);
      editor.tf.focus();
    },
    [editor.tf, tf.fontSize]
  );

  const handleDecrease = React.useCallback(() => {
    applyFontSize(currentSize - 1);
  }, [applyFontSize, currentSize]);

  const handleIncrease = React.useCallback(() => {
    applyFontSize(currentSize + 1);
  }, [applyFontSize, currentSize]);

  const handleSubmit = React.useCallback(() => {
    const parsed = Number.parseInt(inputValue, 10);
    if (!Number.isNaN(parsed)) {
      applyFontSize(parsed);
    } else {
      setInputValue(currentSize.toString());
    }
  }, [applyFontSize, currentSize, inputValue]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="flex h-8 items-center rounded-md border border-border bg-background text-sm shadow-sm">
      <button
        className="flex h-full w-8 items-center justify-center rounded-l-md transition-colors hover:bg-muted"
        onClick={handleDecrease}
        type="button"
      >
        <Minus className="size-4" />
      </button>

      <input
        className={cn(
          'h-full w-12 border-x border-border bg-transparent text-center outline-none transition-colors',
          'focus:bg-muted focus:text-foreground'
        )}
        value={inputValue}
        onBlur={handleSubmit}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
          }
        }}
        aria-label="Font size"
      />

      <button
        className="flex h-full w-8 items-center justify-center rounded-r-md transition-colors hover:bg-muted"
        onClick={handleIncrease}
        type="button"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
