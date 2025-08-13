import { SignIn } from '@clerk/nextjs'
import { div } from 'motion/react-client'

export default function Page() {
  return (
    <div className='flex items-center justify-center h-screen'>
        <SignIn/>
    </div>
  )
}