import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavigateButton = ({title, desc, link, icon}) => {

  return (
    <Link href={link} className='w-[90vw] mx-4 my-2 p-2 bg-black-950 hover:bg-blue-400/50 border-1 border-gray rounded-xl flex items-center'>
      {icon}
      <div className='text-left'>
        <span className='text-sm text-white-950'>{title}</span>
        <p className='text-xs text-white-250'>{desc}</p>
      </div>
      <ChevronRight size={16} color='#ABB0BA' className='ml-auto'/>
    </Link>
  )
}

export default NavigateButton