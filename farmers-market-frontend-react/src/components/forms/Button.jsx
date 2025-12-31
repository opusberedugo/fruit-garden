import React from 'react';

export default function FormButton({ text, children, className }) {
  return (
    <button className={'w-full py-2 px-4 text-white rounded-md ' + className}>
      {children}
      {text}
    </button>
  )
}
