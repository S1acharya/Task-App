import Head from 'next/head'
import TaskList from '@/components/TaskList'

import prisma from '@/lib/prisma'

export async function getStaticProps() {

  // initially fetch the list of tasks from database
  const tasksList = await prisma.task.findMany();

  return {
    props: { tasksList }
  }
}

export default function Home({ tasksList }) {

  return (
    <div>
      <Head>
        <title>Task List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4">
        <div className="flex flex-row justify-center">
          <TaskList tasksList={tasksList} />
        </div>
      </main>
    </div>
  )
}
