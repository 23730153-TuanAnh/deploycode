import React, { useState } from 'react'
import './css/addData.css'
import { imageDb } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function Newtab() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        en: {
            name: '',
            content: '',
            mainComponents: '',
            functions: '',
            images: []
        },
        vi: {
            name: '',
            content: '',
            mainComponents: '',
            functions: '',
            images: []
        }
    });

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e, language) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [language]: {
                ...formData[language],
                [name]: value
            }
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevData => ({
            ...prevData,
            en: {
                ...prevData.en,
                images: [...prevData.en.images, ...files]
            },
            vi: {
                ...prevData.vi,
                images: [...prevData.vi.images, ...files]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploadedImageUrls = [];

        for (const image of formData.en.images) {
            if (!(image instanceof File)) {
                console.error('Invalid image file:', image);
                continue;
            }

            const imageRef = ref(imageDb, `images/${uuidv4()}_${image.name}`);

            try {
                const snapshot = await uploadBytes(imageRef, image);
                const downloadURL = await getDownloadURL(snapshot.ref);
                uploadedImageUrls.push(downloadURL);
                console.log('Image uploaded successfully:', downloadURL);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const formDataId = uuidv4();
        const formDataWithUrls = {
            id: formDataId,
            en: { ...formData.en, images: uploadedImageUrls },
            vi: { ...formData.vi, images: uploadedImageUrls }
        };

        let storedData = JSON.parse(localStorage.getItem('formData')) || [];
        storedData.push(formDataWithUrls);
        localStorage.setItem('formData', JSON.stringify(storedData));

        setFormData({
            en: {
                name: '',
                content: '',
                mainComponents: '',
                functions: '',
                images: []
            },
            vi: {
                name: '',
                content: '',
                mainComponents: '',
                functions: '',
                images: []
            }
        });
    };



    const handleRemoveImage = (index, language) => {
        const updatedImages = [...formData[language].images];
        updatedImages.splice(index, 1);
        setFormData({
            ...formData,
            [language]: {
                ...formData[language],
                images: updatedImages
            }
        });
    };
    return (
        <>
            <button className='add-button' onClick={toggleDrawer}>
                +
            </button>
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <button className="floating-button" onClick={toggleDrawer}>
                    X
                </button>
                <>
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <div className="section">
                                <h2>Name (English)</h2>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.en.name}
                                    onChange={(e) => handleChange(e, 'en')}
                                />
                                <h2>Tên (Tiếng Việt)</h2>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.vi.name}
                                    onChange={(e) => handleChange(e, 'vi')}
                                />
                            </div>

                            <div className="section">
                                <h2>Content (English)</h2>
                                <textarea
                                    name="content"
                                    value={formData.en.content}
                                    onChange={(e) => handleChange(e, 'en')}
                                />
                                <h2>Nội dung (Tiếng Việt)</h2>
                                <textarea
                                    name="content"
                                    value={formData.vi.content}
                                    onChange={(e) => handleChange(e, 'vi')}
                                />
                            </div>

                            <div className="section">
                                <h2>Main Components (English)</h2>
                                <textarea
                                    name="mainComponents"
                                    value={formData.en.mainComponents}
                                    onChange={(e) => handleChange(e, 'en')}
                                />
                                <h2>Thành phần chính (Tiếng Việt)</h2>
                                <textarea
                                    name="mainComponents"
                                    value={formData.vi.mainComponents}
                                    onChange={(e) => handleChange(e, 'vi')}
                                />
                            </div>

                            <div className="section">
                                <h2>Functions (English)</h2>
                                <textarea
                                    name="functions"
                                    value={formData.en.functions}
                                    onChange={(e) => handleChange(e, 'en')}
                                />
                                <h2>Các chức năng (Tiếng Việt)</h2>
                                <textarea
                                    name="functions"
                                    value={formData.vi.functions}
                                    onChange={(e) => handleChange(e, 'vi')}
                                />
                            </div>

                            <div className="section">
                                <h2>Images</h2>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                    style={{ fontSize: "30px" }}
                                />
                            </div>

                            <div className="section">
                                <h2>Uploaded Images</h2>
                                <div className="image-preview">
                                    {formData.en.images.map((image, index) => (
                                        <span key={index} className="image-item">
                                            <img
                                                src={image instanceof File ? URL.createObjectURL(image) : image}
                                                alt={`Uploaded ${index}`}
                                                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                                            />
                                            <button
                                                style={{ position: "absolute", background: "red", fontSize: "30px" }}
                                                type="button"
                                                onClick={() => handleRemoveImage(index, 'en')}
                                            >
                                                X
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </>
            </div>
        </>

    )
}
