import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const dropzoneStyle = {
    border: '2px dashed #ccc',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '4px',
    userSelect: "none",
    backgroundColor: '#f9f9f9',
};

const deactivatedDropzoneStyle = {
    ...dropzoneStyle,
    cursor: 'not-allowed',
    opacity: '0.5',
};

const imageItemStyle = {
    margin: '10px',
    position: 'relative',
    cursor: 'grab',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px 4px 0 0',
};

const mainImageLabelStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '3px 6px',
    fontSize: '12px',
    borderRadius: '4px',
};

const removeBtnStyle = {
    display: 'block',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
};
interface Image {
    path: string;
    name: string;
    main: boolean;
}

const ImageUploadComponent = (props) => {
    
    const isDeactivated = location.href.includes('herokuapp.com') || location.href.includes('onrender.com');
    const [images, setImages] = useState([]);
    const [uuid, setUUID] = useState('');
    
    useEffect(() => {
        const parameters = props.record.params;
        const currentImages = Object.keys(parameters)
            .filter((key) => key.startsWith("images."))
            .map((key) => parameters[key])
            .map((path) => {
                const directories = path.split('/');
                return {
                    name: directories[directories.length - 1],
                    path: path,
                };
            });
            if (currentImages.length > 0) {
            const directories = currentImages[0].path.split('/');
            const directory = directories[directories.length - 2];
            setImages(sortImagesWithMainFirst(currentImages));
            setUUID(directory);
        }
    }, [props.record.params.images, props.record.params.uuid]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const uploadedImages = await uploadImages(acceptedFiles);
        setImages((prevImages: Image[]) => {
            return sortImagesWithMainFirst([...prevImages, ...uploadedImages]);
        });
    }, [images, uuid]);

    const sortImagesWithMainFirst = (images) => {
        // Check if any image is marked as main, if yes, set that image as the first one
        const mainImage = images.find((image) => image.main);
        if (mainImage) {
            const filteredImages = images.filter((image) => image !== mainImage);
            const imagesSorted: Image[] = [mainImage, ...filteredImages];
            setImages(imagesSorted);
            props.onChange(props.property.name, JSON.stringify(imagesSorted));
            return imagesSorted;
        }
        // If no image is marked as main, set the first image as main
        if (images.length > 0) images[0].main = true;
        setImages(images);
        props.onChange(props.property.name, JSON.stringify(images));
        return images;
    };

    const handleImageRemove = async (image) => {
        try {
            await axios.delete(`/api/image?path=${image.path}`);
            setImages((prevImages) => {
                const filteredImages = prevImages.filter((img) => img.name !== image.name);
                return sortImagesWithMainFirst(filteredImages);
            });
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    const uploadImages = async (files: File[]) => {
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            // Use the existing UUID value if available
            const currentUuid = uuid || props.record.params.uuid;

            const response = await axios.post(`/api/images?uuid=${currentUuid || ""}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const directory = response.data.uuid;
            props.onChange("uuid", directory);
            const uploadedFiles = response.data.files.map((file) => ({
                name: file.filename,
                path: `/uploads/${directory}/${file.filename}`,
            }));
            return uploadedFiles;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleImageDragStart = (index) => (event) => {
        event.dataTransfer.setData('imageIndex', index);
    };

    const handleImageDrop = (hoverIndex) => (event) => {
        const dragIndex = event.dataTransfer.getData('imageIndex');
        const draggedImage: Image = images[dragIndex];

        draggedImage.main = hoverIndex === 0;
        const updatedImages: Image[] = [...images];
        updatedImages.splice(dragIndex, 1);
        updatedImages.splice(hoverIndex, 0, draggedImage);
        const oldMainImage: Image = updatedImages[1];

        if (oldMainImage) {
            oldMainImage.main = false;
            updatedImages.splice(1, 1, oldMainImage);
        }
        setImages(sortImagesWithMainFirst(updatedImages));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, disabled: isDeactivated });

    return (
        <div className="image-upload">
            <h3>Image Upload</h3>
            <div
                {...getRootProps()}
                style={ isDeactivated ? deactivatedDropzoneStyle : dropzoneStyle }
            >
                <input formAction="/api/upload" {...getInputProps()} />
                <p style={{color: `${isDeactivated ? 'red' : 'black'}`}}>{isDeactivated ? 'Disabled: Currently Unavailable due to Hosting Limitations. On your server this feature will be available.' : 'Drag and drop an image here or click to browse'} </p>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', marginTop: '10px', padding: '0' }}>
                {images.map((image: Image, index) => (
                    <li
                        key={index}
                        style={imageItemStyle}
                        onDragStart={ handleImageDragStart(index)}
                        onDrop={handleImageDrop(index)}
                        onDragOver={(event) => event.preventDefault()}
                    >
                        <img src={image.path} alt={`Image ${index + 1}`} style={imageStyle} />
                        {image.main ? <span style={mainImageLabelStyle}>Main Image</span> : null}
                        <div
                            style={removeBtnStyle}
                            onClick={() => handleImageRemove(image)}
                        >
                            Remove
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ImageUploadComponent;
