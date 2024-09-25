import React, { useState } from 'react'
import './css/addData.css'
import Newtab from './Newtab';
import { Drawer } from 'antd';
export default function AddData() {
    const [drawerOpen, setDrawerOpen] = useState(true);
    console.log("drawerOpen", drawerOpen);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };




    return (
        <div>
            {/* <button className='add-button'>
                +
            </button> */}
            <Newtab />
        </div>

    )
}
