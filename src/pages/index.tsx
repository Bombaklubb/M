import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Matteträning ÅK 1-9</title>
        <meta name="description" content="Matematikträning för årskurs 1-9 enligt svensk läroplan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Matteträning
          </h1>
          <p className="text-xl text-gray-600">
            Träna matematik för årskurs 1–9
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <Link
            href="/elev/login"
            className="flex-1 card card-hover text-center py-12 group"
          >
            <div className="text-6xl mb-4">🎒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600">
              Elev
            </h2>
            <p className="text-gray-600">
              Logga in och börja träna
            </p>
          </Link>

          <Link
            href="/larare/login"
            className="flex-1 card card-hover text-center py-12 group"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600">
              Lärare
            </h2>
            <p className="text-gray-600">
              Följ elevers progression
            </p>
          </Link>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Matematikträning enligt Lgr22</p>
        </footer>
      </main>
    </>
  )
}
