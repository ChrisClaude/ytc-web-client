import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()
  const handleCallToAPI = () => {
    console.log("Call to API");

    fetch(`${process.env.NEXT_PUBLIC_LOCAL_API}/identity`)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  };

  if (session && session.user) {
    console.log(session)
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className='bg-blue-500 pt-2 px-4 rounded-sm text-center text-sm hover:cursor-pointer mr-3' onClick={() => signOut()}>Sign out</button>
        <button
          className='bg-blue-500 pt-2 px-4 rounded-sm text-center text-sm hover:cursor-pointer'
          onClick={handleCallToAPI}
        >Call API</button>
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
