import React from 'react'
import img from './img/1.jpg'
import './css/Body.css'
import Navbar from './Navbar'
import AddData from './AddData'
export default function Body() {
    return (
        <>
            <Navbar />
            <img src={img} className='img-body' />
            <AddData />
        </>
    )
}
