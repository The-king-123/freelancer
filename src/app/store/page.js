'use client'
import React, { useEffect } from 'react'

function page() {
    useEffect(() => {
        window.location = '/store/all'
    }, [])
}

export default page