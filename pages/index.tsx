import { GetStaticProps } from "next";
import Head from "next/head";
import vercelConfig from "../vercel.json";

interface Bot {
  path: string;
  url: string;
  name: string;
}

interface HomeProps {
  bots: Bot[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const allRoutes = [
    ...vercelConfig.rewrites.map((r) => ({
      source: r.source,
      destination: r.destination,
    })),
    ...vercelConfig.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
    })),
  ];

  const botMap = new Map<string, Bot>();

  allRoutes.forEach((route) => {
    if (route.source !== "/" && !route.source.includes(":match")) {
      const path = route.source;
      const url = route.destination.replace(/\/:match\*$/, "");
      const name =
        path.substring(1).charAt(0).toUpperCase() + path.substring(2);

      if (!botMap.has(path)) {
        botMap.set(path, { path, url, name });
      }
    }
  });

  return {
    props: {
      bots: Array.from(botMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    },
  };
};

export default function Home({ bots }: HomeProps) {
  return (
    <>
      <Head>
        <title>Bots</title>
        <meta name="description" content="A collection of bots by NGSIM" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Bots" />
        <meta
          property="og:description"
          content="A collection of bots by NGSIM"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Bots" />
        <meta
          name="twitter:description"
          content="A collection of bots by NGSIM"
        />
      </Head>
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">🤖</h1>
          <ul className="space-y-4">
            {bots.map((bot) => (
              <li key={bot.path}>
                <a
                  href={`https://bot.ngsim.net${bot.path}`}
                  className="text-gray-600 hover:text-red-600 text-lg"
                >
                  {bot.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <footer className="mt-16 text-gray-500 text-sm">
          {new Date().getFullYear()} © NGSIM
        </footer>
      </main>
    </>
  );
}
