import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';

export default function Items() {
    const [storedData, setStoredData] = useState([]);
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        const data = localStorage.getItem('formData');
        const locale = localStorage.getItem('locales');

        if (data) {
            const parsedData = JSON.parse(data);
            if (parsedData) {
                setStoredData(parsedData);
            } else {
                console.log('No data found');
            }
        }
        if (locale) {
            setLocale(locale);
        }
    }, []);
    return (
        <List style={{ width: "600px" }}>
            {Array.isArray(storedData) && storedData.map((item, index) => (
                <div key={index}>
                    <ListItem button component={Link} to={`/details/${item.id}`}>
                        <ListItemAvatar>
                            <Avatar src={item.en?.images?.[0]} style={{ width: '200px', height: '200px' }} />
                        </ListItemAvatar>
                        <ListItemText primary={locale === 'en' ? item.en?.name : item.vi?.name} />
                    </ListItem>
                    <Divider />
                </div>
            ))}
        </List>
    )
}
