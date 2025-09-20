import React from 'react'

const Card: React.FC<{ title?: string; className?: string; children?: React.ReactNode }> = ({ title, className, children }) => (
  <div className={`bg-white rounded shadow-sm p-4 ${className || ''}`}>
    {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
    <div>{children}</div>
  </div>
)

export default Card
