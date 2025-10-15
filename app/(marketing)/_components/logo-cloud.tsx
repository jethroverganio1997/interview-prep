export default function LogoCloud() {
  const companies = [
    "Google",
    "Microsoft",
    "GitHub",
    "Uber",
    "Notion",
  ]

  return (
    <section id="clients" className="mx-auto max-w-7xl px-6 text-center md:px-8">
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              {companies.map((company) => (
                <li key={company}>
                  <div className="h-8 w-28 px-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">
                      {company}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
