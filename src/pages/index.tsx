import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()


  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className='bg-blue-500 pt-2 px-4 rounded-sm text-center text-sm hover:cursor-pointer' onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className='bg-blue-500 pt-2 px-4 rounded-sm text-center text-sm hover:cursor-pointer' onClick={() => signIn()}>Sign in</button>
    </>
  )
}
