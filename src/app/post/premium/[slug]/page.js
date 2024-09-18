'use client'
import React from 'react'

function page({params}) {
  return (
    <div>{params.slug}</div>
  )
}

export default page