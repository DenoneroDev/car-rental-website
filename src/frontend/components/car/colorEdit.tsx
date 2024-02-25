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
    const color = (parameter.color) ? parameter.color : "Select...";

    const handleColorDropDownChange = (color) => {
        onChange("color", color.value);
    };


    const colors = [
        { value: "White", label: "White" },
        { value: "Black", label: "Black" },
        { value: "Beige", label: "Beige" },
        { value: "Red", label: "Red" },
        { value: "Blue", label: "Blue" },
        { value: "Gray", label: "Gray" },
        { value: "Silver", label: "Silver" },
        { value: "Yellow", label: "Yellow" },
        { value: "Green", label: "Green" },
        { value: "Brown", label: "Brown" },
        { value: "Bronze", label: "Bronze" },
        { value: "Gold", label: "Gold" },
        { value: "Orange", label: "Orange" },
        { value: "Purple", label: "Purple" },
    ];
    return (
        <div style={{ marginTop: 32 }}>
            <Label>Color</Label>
            <Select
                value={{ value: color, label: color }}
                options={colors}
                onChange={(color) => handleColorDropDownChange(color)}
            />

        </div>
    );
};

export default Edit;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/