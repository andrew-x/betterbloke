import { Loader } from '@mantine/core'
import { Suspense } from 'react'
import ListSection from './_ListSection'

export default function Home() {
  return (
    <div className="flex flex-col gap-y-2 full-size">
      <main className="center-col py-2 grow">
        <section className="content-size text-center">
          <h1 className="text-4xl font-semibold">BetterBloke</h1>
          <p className="mt-2">
            A more organized way to browse LLM models quantized by{' '}
            <a href="https://huggingface.co/TheBloke" target="_blank">
              TheBloke
            </a>{' '}
            and published on{' '}
            <a href="https://huggingface.co" target="_blank">
              HuggingFace
            </a>
          </p>
        </section>
        <Suspense
          fallback={
            <section className="center-content w-full py-10">
              <Loader type="dots" />
            </section>
          }
        >
          <ListSection className="content-size" />
        </Suspense>
      </main>
      <footer className="text-center text-sm py-2 text-slate-400">
        Made with <span aria-label="heart icon">&#x2764;</span> by{' '}
        <a href="https://andrewxia.com" target="_blank">
          Andrew Xia
        </a>
      </footer>
    </div>
  )
}
