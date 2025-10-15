import Image from "next/image"

export default function LogoCloud() {
  const companies = [
    { name: "Google", logo: "/images/Google.svg" },
    { name: "Microsoft", logo: "/images/Microsoft.svg" },
    { name: "GitHub", logo: "/images/GitHub.svg" },
    { name: "Uber", logo: "/images/Uber.svg" },
    { name: "Notion", logo: "/images/Notion.svg" },
  ]

  return (
    <section id="clients" className="mx-auto max-w-7xl px-6 text-center md:px-8">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              {companies.map((company) => (
                <li key={company.name}>
                  <div className="h-8 w-28 px-2 flex items-center justify-center">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={112}
                      height={32}
                      className="h-8 w-auto max-w-full object-contain filter grayscale dark:invert opacity-60 hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </section>
  )
}
