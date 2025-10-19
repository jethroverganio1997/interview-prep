'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { LineHeightPlugin } from '@platejs/basic-styles/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckIcon, WrapText } from 'lucide-react';
import { useEditorRef, useSelectionFragmentProp } from 'platejs/react';

import { ToolbarButton } from '@/components/editor/ui/toolbar';

export function LineHeightToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const { defaultNodeValue, validNodeValues: values = [] } =
    editor.getInjectProps(LineHeightPlugin);

  const value =
    useSelectionFragmentProp({
      defaultValue: defaultNodeValue,
      getProp: (node) => node.lineHeight,
    }) ?? defaultNodeValue;

  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Line height" isDropdown>
          <WrapText className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-0" align="start">
        <DropdownMenuRadioGroup
          value={value?.toString()}
          onValueChange={(newValue) => {
            editor
              .getTransforms(LineHeightPlugin)
              .lineHeight.setNodes(Number(newValue));
            editor.tf.focus();
          }}
        >
          {values.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              className="min-w-[180px] pl-2 *:first:[span]:hidden"
              value={option.toString()}
            >
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                <CheckIcon className="size-4" />
              </span>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
