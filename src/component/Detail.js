import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Button, FormControl, ListItemIcon, MenuItem, Select } from '@mui/material';
import us from './img/Flag-United-States-of-America.webp'
import vn from './img/quockyvn.jpg'
// import EditData from '../Edit/Edit';
import { useTranslation } from 'react-i18next';
import './css/details.css'
import EditData from './EditData';

const DisplayData = () => {
    const [storedData, setStoredData] = useState(null);
    const [locale, setLocale] = useState('en');
    const { id } = useParams();
    const [language, setLanguage] = useState(localStorage.getItem("locales") || "en");
    const { t } = useTranslation();



    useEffect(() => {
        const data = localStorage.getItem('formData');
        const locale = localStorage.getItem('locales');

        if (data) {
            const parsedData = JSON.parse(data);

            const entry = parsedData.find(item => item.id === id);
            if (entry) {
                setStoredData(entry);
            } else {
                console.log(`No data found for id: ${id}`);
            }
        }
        if (locale) {
            setLocale(locale);
        }
    }, [id]);


    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        changeLanguage(selectedLanguage);
    };
    const changeLanguage = (lng) => {
        localStorage.setItem("locales", lng);
        setLanguage(lng);
        window.location.reload();
    };
    const dataToDisplay = storedData ? (locale === 'en' ? storedData.en : storedData.vi) : null;


    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Link to="/">
                        <IconButton edge="start" color="inherit" aria-label="open drawer">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Link>

                    <FormControl variant="standard" sx={{ marginLeft: 'auto', color: 'white', width: '40%' }}>
                        <Select
                            value={language}
                            onChange={handleLanguageChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{ color: 'white' }}
                        >
                            <MenuItem value="en">
                                <ListItemIcon onClick={() => changeLanguage('en')}>
                                    <Avatar src={us} sx={{ width: '70px', height: '100%' }} />
                                </ListItemIcon>
                                English
                            </MenuItem>
                            <MenuItem value="vi">
                                <ListItemIcon onClick={() => changeLanguage('vi')} >
                                    <Avatar src={vn} sx={{ width: '70px', height: '70px' }} />
                                </ListItemIcon>
                                Tiếng Việt
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <EditData />
                </Toolbar>
            </AppBar>

            <div className="display-data">
                <p style={{
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: "150px"
                }}><strong>{dataToDisplay?.name}</strong> </p>
                <div className="image-preview">
                    {dataToDisplay?.images?.map((image, index) => (
                        <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width: "450px", height: "450px" }} />
                    ))}
                </div>
                {dataToDisplay?.content && (
                    <p>
                        <strong>{t('Content')}: </strong>
                        <div className='text-container'>{dataToDisplay.content}</div>
                    </p>
                )}
                {dataToDisplay?.mainComponents && (
                    <p><strong>{t('MainComponents')}:</strong><div className='text-container'>{dataToDisplay?.mainComponents}</div> </p>
                )}
                {dataToDisplay?.functions && (
                    <p><strong>{t('Functions')}:</strong> <div className='text-container'>{dataToDisplay?.functions}</div></p>
                )}
            </div>
        </>
    );
};

export default DisplayData;