import { getData } from '@/server/data'
import cn from '@/util/classnames'
import List from './_List'

export default async function ListSection({
  className,
}: {
  className?: string
}) {
  const data = await getData()
  return (
    <section className={cn('', className)}>
      <List groups={data} />
    </section>
  )
}
