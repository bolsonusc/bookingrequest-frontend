import Link from 'next/link'
import React from 'react'

const QueckAction = ({ title, link, icon }) => {

    return (
        <Link href={link} className='w-full  my-2 p-4 bg-[#16171A]  rounded-md  flex items-center justify-center flex-wrap hover:bg-blue-600 transition-all duration-300'>
            {icon}
            <p className='text-m text-white ml-2 w-full text-center mt-2'>{title}</p>
        </Link>
    )
}

export { QueckAction }