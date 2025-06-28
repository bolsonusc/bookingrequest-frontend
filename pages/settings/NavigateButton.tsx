import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NavigateButton = ({title, desc, link, icon}) => {

  return (
    <Link href={link} className='w-[90vw] mx-4 my-2 p-2 bg-black-950 border-1 border-gray rounded-xl flex'>
      <Image src={`./icons/${icon}.svg`} className='mx-4' alt={title} height={16} width={16} />
      <div className='text-left'>
        <span className='text-sm text-white-950'>{title}</span>
        <p className='text-xs text-white-250'>{desc}</p>
      </div>
      <Image src='./icons/rightArrow.svg' className='ml-auto' alt='Go' height={16} width={16} />
    </Link>
  )
}

export default NavigateButton