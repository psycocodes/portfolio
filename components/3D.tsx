import styles from "@/app/page.module.css"
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/scene'), {
    ssr: true,
})

export default function ThreejsComponent() {
  return (
    <main className={styles.main}>
        <Scene />
    </main>
  )
}