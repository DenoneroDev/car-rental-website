import React, { useEffect, useState } from "react";
import { BasePropertyProps, Box, Label } from 'admin-bro';
import axios from "axios";
import Select from 'react-select';

const Edit: React.FC<BasePropertyProps> = ({ property, onChange, record }) => {

    if (!record || !onChange) {
        return (
            <Box marginBottom="xxl">
                <Label>{property.label} | Error: Something went wrong!</Label>
            </Box>
        );
    }

    const parameter = record.params;
    const transmission = (parameter.transmission) ? parameter.transmission : "Select...";

    const handleTransmissionDropDownChange = (transmission) => {
        onChange("transmission", transmission.value);
    };


    const transmissions = [
        { value: "Automatic", label: "Automatic" },
        { value: "Manually", label: "Manually" },
    ];
    return (
        <div style={{ marginTop: 32, marginBottom: 32}}>
            <Label>Transmission</Label>
            <Select
                value={{ value: transmission, label: transmission }}
                options={transmissions}
                onChange={(transmission) => handleTransmissionDropDownChange(transmission)}
            />

        </div>
    );
};

export default Edit;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/