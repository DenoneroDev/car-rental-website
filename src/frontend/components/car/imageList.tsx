import React from 'react';
import { BasePropertyProps, Box } from 'admin-bro';

const Edit: React.FC<BasePropertyProps> = ({ record }) => {

    if (!record) {
        return (
            <Box>Something went wrong!</Box>
        );
    }
    const parameters = record.params;
    const image = parameters['images.0'];

    return (
        <Box>
            {image ? (
                <img src={image} width="100px" />
            ) : 'No images'};
        </Box>
    );
}

export default Edit;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/