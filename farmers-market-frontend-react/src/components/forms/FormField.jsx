import React from "react";
import { useState } from "react";

export default function FormField({ name, type, placeholder, label, required, value, onChange, className = '' }) {
  const [error, setError] = useState('')


  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name} className='block text-gray-700 font-medium mb-2'>{label} {required && <span className='text-red-500'>*</span>}</label>
      <input type={type} id={name} name={name} placeholder={placeholder} value={value} className={`w-full px-4 py-3 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-gray-900'} focus:border-transparent transition-colors`} />
      {error && <p className='error-label mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  )
}