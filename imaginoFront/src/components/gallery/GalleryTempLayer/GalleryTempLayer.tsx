import React from 'react'

export default function GalleryTempLayer({children}:{children? : React.ReactNode}) {
  return (
    <>
      <div className=" absolute top-0 right-0 left-0 bottom-0  p-3  opacity-0  hover:opacity-100 transition duration-500 z-20 bg-[#00000079] cursor-zoom-in">
      <span className='opacity-100'>
        {
        children
       }
      </span>
      </div>
    </>
  )
}
