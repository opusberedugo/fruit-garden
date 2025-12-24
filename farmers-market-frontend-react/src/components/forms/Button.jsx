import React from 'react';

export default function FormButton({ text, children }) {
  return (
    <button className='w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800'>
      {children}
      {text}
    </button>
  )
}
