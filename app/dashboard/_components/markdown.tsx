import type { Components } from "react-markdown";
import type { HTMLAttributes, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

type CodeBlockProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  children?: ReactNode;
};

const markdownComponents: Components = {
  p: ({ className, children, ...props }) => (
    <p
      {...props}
      className={cn(
        "text-sm leading-7 text-muted-foreground [&:not(:first-child)]:mt-4",
        className,
      )}
    >
      {children}
    </p>
  ),
  h1: ({ className, children, ...props }) => (
    <h1
      {...props}
      className={cn(
        "mt-6 text-xl font-semibold leading-tight text-foreground first:mt-0",
        className,
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }) => (
    <h2
      {...props}
      className={cn(
        "mt-5 text-lg font-semibold leading-tight text-foreground first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }) => (
    <h3
      {...props}
      className={cn(
        "mt-4 text-base font-semibold leading-tight text-foreground first:mt-0",
        className,
      )}
    >
      {children}
    </h3>
  ),
  ul: ({ className, children, ...props }) => (
    <ul
      {...props}
      className={cn(
        "mt-4 space-y-2 pl-5 text-sm leading-6 text-muted-foreground first:mt-0",
        "list-disc marker:text-muted-foreground",
        className,
      )}
    >
      {children}
    </ul>
  ),
  ol: ({ className, children, ...props }) => (
    <ol
      {...props}
      className={cn(
        "mt-4 space-y-2 pl-5 text-sm leading-6 text-muted-foreground first:mt-0",
        "list-decimal marker:text-muted-foreground",
        className,
      )}
    >
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }) => (
    <li
      {...props}
      className={cn(
        "[&>p]:mt-0 [&>p]:text-sm [&>p]:leading-6",
        className,
      )}
    >
      {children}
    </li>
  ),
  a: ({ className, children, ...props }) => (
    <a
      {...props}
      className={cn(
        "font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  ),
  blockquote: ({ className, children, ...props }) => (
    <blockquote
      {...props}
      className={cn(
        "mt-4 border-l-2 border-border/60 pl-4 text-sm italic text-muted-foreground first:mt-0",
        className,
      )}
    >
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: CodeBlockProps) => {
    if (inline) {
      return (
        <code
          {...props}
          className={cn(
            "rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground",
            className,
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <pre
        {...props}
        className={cn(
          "mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm text-foreground first:mt-0",
          className,
        )}
      >
        <code>{children}</code>
      </pre>
    );
  },
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
