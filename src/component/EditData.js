import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Modal } from 'antd';
import "./css/edit.css"
import { useParams } from 'react-router-dom';
import { imageDb } from '../firebase';

const EditData = () => {
    const [storedData, setStoredData] = useState(null);
    const [locale, setLocale] = useState('en');
    const { id } = useParams();
    const [language, setLanguage] = useState(localStorage.getItem("locales") || "en");
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
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

    if (!storedData) {
        return <p>No data found in LocalStorage</p>;
    }
    console.log("storedData", storedData);
    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        changeLanguage(selectedLanguage);
    };

    const changeLanguage = (lng) => {
        localStorage.setItem("locales", lng);
        setLanguage(lng);
        window.location.reload();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStoredData(prevData => ({
            ...prevData,
            [locale]: {
                ...prevData[locale],
                [name]: value
            }
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prevImages => [...prevImages, ...files]);

        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviews => [...prevPreviews, ...previewUrls]);
    };

    const handleDeletePreviewImage = (index) => {
        const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
        const updatedNewImages = newImages.filter((_, i) => i !== index);

        setPreviewImages(updatedPreviewImages);
        setNewImages(updatedNewImages);
    };

    const handleDeleteImage = async (index) => {
        console.log("index", index);
        try {
            const updatedEnImages = storedData.en.images.filter((_, i) => i !== index);
            const updatedViImages = storedData.vi.images.filter((_, i) => i !== index);

            const updatedData = {
                ...storedData,
                en: {
                    ...storedData.en,
                    images: updatedEnImages
                },
                vi: {
                    ...storedData.vi,
                    images: updatedViImages
                }
            };

            const data = localStorage.getItem('formData');
            if (data) {
                const parsedData = JSON.parse(data);
                const updatedDataArray = parsedData.map(item => item.id === id ? updatedData : item);
                localStorage.setItem('formData', JSON.stringify(updatedDataArray));
            }

            setStoredData(updatedData);
            if (updatedEnImages.length === 0 && updatedViImages.length === 0) {
                setStoredData(prevData => ({
                    ...prevData,
                    en: {
                        ...prevData.en,
                        images: []
                    },
                    vi: {
                        ...prevData.vi,
                        images: []
                    }
                }));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };



    const handleSave = async () => {
        const storage = getStorage();
        const uploadedImageUrls = [];

        for (const image of newImages) {
            const imageRefEn = ref(storage, `images/${uuidv4()}_${image.name}`);

            try {
                const snapshotEn = await uploadBytes(imageRefEn, image);
                const downloadURLEn = await getDownloadURL(snapshotEn.ref);
                uploadedImageUrls.push(downloadURLEn);
                console.log('Image uploaded successfully (EN):', downloadURLEn);

            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const updatedData = {
            ...storedData,
            en: {
                ...storedData.en,
                images: [...(storedData?.en.images || []), ...uploadedImageUrls]
            },
            vi: {
                ...storedData.vi,
                images: [...(storedData?.vi.images || []), ...uploadedImageUrls]
            }
        };

        const data = localStorage.getItem('formData');
        if (data) {
            const parsedData = JSON.parse(data);
            const updatedDataArray = parsedData.map(item => item.id === id ? updatedData : item);
            localStorage.setItem('formData', JSON.stringify(updatedDataArray));
        }
        window.location.reload();
        // setStoredData(updatedData);
        // setPreviewImages([]);
        // setNewImages([]);
    };

    const dataToEdit = locale === 'en' ? storedData.en : storedData.vi;

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                sx={{ marginLeft: 2 }}
                type="primary" onClick={showModal}
            >
                Edit
            </Button>
            <Modal
                title="Basic Modal"
                visible={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" className="custom-ok-button" onClick={() => {
                        handleOk();
                        handleSave();
                    }}>
                        OK
                    </Button>,
                ]}
                width="100%">
                <div className="edit-data">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={dataToEdit?.name}
                        onChange={handleChange}
                        className="form-input"
                    />

                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={dataToEdit?.content}
                        onChange={handleChange}
                        className="form-textarea"
                    ></textarea>

                    <label htmlFor="mainComponents">Main Components</label>
                    <textarea
                        id="mainComponents"
                        name="mainComponents"
                        value={dataToEdit?.mainComponents}
                        onChange={handleChange}
                        className="form-textarea"
                    ></textarea>

                    <label htmlFor="functions">Functions</label>
                    <textarea
                        id="functions"
                        name="functions"
                        value={dataToEdit?.functions}
                        onChange={handleChange}
                        className="form-textarea"
                    ></textarea>
                    <input type="file" multiple onChange={handleImageChange} />
                    <div>
                        {storedData && storedData.en && storedData.en.images && storedData.en.images.map((url, index) => (
                            <div key={index} style={{ display: 'inline-block', position: 'relative' }}>
                                <img src={url} alt={`en-img-${index}`} style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                                <button
                                    style={{ position: "absolute", background: "red", fontSize: "30px", right: "5px" }}
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        {previewImages.map((url, index) => (
                            <div key={index} style={{ display: 'inline-block', position: 'relative' }}>
                                <img src={url} alt={`preview-${index}`} style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                                <button
                                    style={{ position: "absolute", background: "red", fontSize: "30px", right: "5px" }}
                                    type="button"
                                    onClick={() => handleDeletePreviewImage(index, 'en')}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditData;