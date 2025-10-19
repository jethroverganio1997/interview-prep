'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { ListStyleType, someList, toggleList } from '@platejs/list';
import { KEYS } from 'platejs';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import {
  useEditorRef,
  useEditorSelector,
  useSelectionFragmentProp,
} from 'platejs/react';
import {
  CheckIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolbarButton } from '@/components/editor/ui/toolbar';

type TurnIntoItem =
  | {
      label: string;
      value: string;
      icon: React.ReactNode;
      kind: 'block';
    }
  | {
      label: string;
      value: string;
      icon: React.ReactNode;
      kind: 'list';
      listStyleType: ListStyleType;
    };

const turnIntoItems: TurnIntoItem[] = [
  {
    label: 'Text',
    value: KEYS.p,
    icon: <PilcrowIcon className="size-4" />,
    kind: 'block',
  },
  {
    label: 'Heading 1',
    value: 'h1',
    icon: <Heading1Icon className="size-4" />,
    kind: 'block',
  },
  {
    label: 'Heading 2',
    value: 'h2',
    icon: <Heading2Icon className="size-4" />,
    kind: 'block',
  },
  {
    label: 'Heading 3',
    value: 'h3',
    icon: <Heading3Icon className="size-4" />,
    kind: 'block',
  },
  {
    label: 'Bulleted list',
    value: KEYS.ul,
    icon: <ListIcon className="size-4" />,
    kind: 'list',
    listStyleType: ListStyleType.Disc,
  },
  {
    label: 'Numbered list',
    value: KEYS.ol,
    icon: <ListOrderedIcon className="size-4" />,
    kind: 'list',
    listStyleType: ListStyleType.Decimal,
  },
  {
    label: 'Quote',
    value: KEYS.blockquote,
    icon: <QuoteIcon className="size-4" />,
    kind: 'block',
  },
];

function setBlockType(editor: Editor, type: string) {
  Transforms.setNodes(
    editor,
    { type } as Partial<SlateElement>,
    {
      match: (node) =>
        SlateElement.isElement(node) && Editor.isBlock(editor, node),
    }
  );
}

export function TurnIntoToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);
  const isBulleted = useEditorSelector(
    (valueEditor) =>
      someList(valueEditor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    []
  );
  const isNumbered = useEditorSelector(
    (valueEditor) =>
      someList(valueEditor, [
        ListStyleType.Decimal,
        ListStyleType.LowerAlpha,
        ListStyleType.UpperAlpha,
        ListStyleType.LowerRoman,
        ListStyleType.UpperRoman,
      ]),
    []
  );

  const value =
    useSelectionFragmentProp({
      defaultValue: KEYS.p,
      getProp: (node) =>
        SlateElement.isElement(node) ? (node.type as string | undefined) : undefined,
    }) ?? KEYS.p;
  const currentValue = isBulleted
    ? KEYS.ul
    : isNumbered
      ? KEYS.ol
      : value;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          className="min-w-[130px] justify-between"
          isDropdown
          pressed={open}
          tooltip="Turn into"
        >
          {turnIntoItems.find((item) => item.value === currentValue)?.label ??
            'Turn into'}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[200px]">
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={(nextValue) => {
            const item = turnIntoItems.find(
              (candidate) => candidate.value === nextValue
            );
            if (!item) return;

            if (item.kind === 'list') {
              toggleList(editor, { listStyleType: item.listStyleType });
            } else {
              if (isBulleted) {
                toggleList(editor, { listStyleType: ListStyleType.Disc });
              }
              if (isNumbered) {
                toggleList(editor, { listStyleType: ListStyleType.Decimal });
              }
              setBlockType(editor as unknown as Editor, item.value);
            }

            editor.tf.focus();
            setOpen(false);
          }}
        >
          {turnIntoItems.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              className="flex items-center gap-2 pl-2"
            >
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                <CheckIcon className="size-4" />
              </span>
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
