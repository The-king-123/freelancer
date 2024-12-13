'use client'
import React, { useEffect } from 'react'

function page() {
    useEffect(() => {
        window.location = '/prospection/all'
    }, [])
}

export default page