'use client'
import React, { useEffect } from 'react'

function createForum() {

  useEffect(() => {
    console.log(localStorage.getItem('userInfos'));
    
  }, [])
  
  return (
    <div>createForum</div>
  )
}

export default createForum