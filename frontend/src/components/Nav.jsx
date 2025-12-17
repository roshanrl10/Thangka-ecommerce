import React from 'react'
import "tailwindcss";

const Nav = () => {
  return (
    <div>
       <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
       <h1 className="text-xl font-semibold">Thangka E-Commmerce</h1>
       <ul className="hidden md:flex gap-6 text-gray-700">
         <li><a className="hover:text-blue-600" href="/">Home</a></li>
         <li><a className="hover:text-blue-600" href="/products">Products</a></li>
         <li><a className="hover:text-blue-600" href="/gallery">Gallery</a></li>
         <li><a className="hover:text-blue-600" href="/contact">Contact</a></li>
       </ul>
       <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
         Login
       </button>
     </nav>
    </div>
  )
}

export default Nav
