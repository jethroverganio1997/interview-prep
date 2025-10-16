import type { Metadata } from "next"
import Header from "../../components/header"
import Footer from "../../components/footer"

export const metadata: Metadata = {
  title: {
    default: "Magic UI - Build beautiful landing pages",
    template: "%s | Magic UI",
  },
  description:
    "Create stunning, high-converting landing pages in minutes with our collection of pre-built components and templates.",
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
