'use client'
import React, { useEffect } from 'react'

function previewForum({forum}) {

    useEffect(() => {
      console.log(forum);
      
    }, [])
    
  return (
    <div>previewForum</div>
  )
}

export default previewForum