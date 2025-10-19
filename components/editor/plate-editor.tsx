"use client";

import { FontSizePlugin, TextAlignPlugin } from "@platejs/basic-styles/react";
import { MarkdownPlugin } from "@platejs/markdown";
import { normalizeNodeId } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { BasicNodesKit } from "@/components/editor/plugins/basic-nodes-kit";
import { FixedToolbarKit } from "@/components/editor/plugins/fixed-toolbar-kit";
import { FloatingToolbarKit } from "@/components/editor/plugins/floating-toolbar-kit";
import { Editor, EditorContainer } from "@/components/editor/ui/editor";

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [
      ...FixedToolbarKit,
      ...FloatingToolbarKit,
      ...BasicNodesKit,
      TextAlignPlugin,
      FontSizePlugin,
      MarkdownPlugin,
    ],
    value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="demo" placeholder="Type..." />
      </EditorContainer>
    </Plate>
  );
}

const value = normalizeNodeId([
  {
    type: "h1",
    children: [{ text: "Full Name" }],
  },
  {
    type: "p",
    children: [
      {
        text: "City, ST · Phone · Email · LinkedIn · Portfolio",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Summary" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Impact-driven Role with X years in domains. Blend strength, strength, and strength to deliver outcome (e.g., “scaled ARR +38% via experiment-led roadmap”).",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Core Skills" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Product: roadmapping, discovery, GTM alignment" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Analytics: SQL, Looker, Amplitude" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Collaboration: stakeholder facilitation, exec reporting" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Ops: agile coaching, OKRs, budgeting" }],
  },
  {
    type: "h2",
    children: [{ text: "Experience" }],
  },
  {
    type: "h3",
    children: [{ text: "Company – Title (Month Year – Present, City/Remote)" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Lead outcome-oriented bullet with metric (e.g., Launched project → +% metric).",
      },
    ],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Showcase cross-functional work and scope.",
      },
    ],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Add innovation/efficiency bullet with quantified result.",
      },
    ],
  },
  {
    type: "h3",
    children: [{ text: "Company – Title (Month Year – Month Year, City/Remote)" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Start with major achievement and measurement.",
      },
    ],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Mention ownership of teams, budgets, or processes.",
      },
    ],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [
      {
        text: "Add customer impact or scale detail.",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Selected Projects" }],
  },
  {
    type: "h3",
    children: [{ text: "Project – Role, Tools (Month Year)" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Short problem → action → result statement with a metric; note scale or collaborators if impressive.",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Education" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Institution – Degree (Month Year) · Honors, GPA (if strong), key coursework.",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Certifications" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Certification, Issuer (Month Year)" }],
  },
  {
    type: "h2",
    children: [{ text: "Awards & Speaking" }],
  },
  {
    type: "p",
    indent: 1,
    listStyleType: "disc",
    children: [{ text: "Event or Award – one-line relevance or outcome." }],
  },
  {
    type: "h2",
    children: [{ text: "Volunteering / Leadership" }],
  },
  {
    type: "p",
    children: [
      {
        text: "Organization – Role (Month Year – Month Year) · Impact statement with numbers if possible.",
      },
    ],
  },
]);
