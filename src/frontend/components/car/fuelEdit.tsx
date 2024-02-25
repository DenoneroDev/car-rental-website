import React, { useEffect, useState } from "react";
import { BasePropertyProps, Box, Label } from 'admin-bro';
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
    const fuel = (parameter.fuel) ? parameter.fuel : "Select...";

    const handleFuelDropDownChange = (fuel) => {
        onChange("fuel", fuel.value);
    };


    const fuels = [
        { value: "Diesel", label: "Diesel" },
        { value: "Electric", label: "Electric" },
        { value: "Gas", label: "Gas" },
        { value: "Gasoline", label: "Gasoline" },
        { value: "Hybrid Electric/Diesel", label: "Hybrid Electric/Diesel" },
        { value: "Hybrid Electric/Gasoline", label: "Hybrid Electric/Gasoline" },
        { value: "Hydrogen", label: "Hydrogen" },
    ];
    return (
        <div style={{ marginTop: 32 }}>
            <Label>Fuel</Label>
            <Select
                value={{ value: fuel, label: fuel }}
                options={fuels}
                onChange={(fuel) => handleFuelDropDownChange(fuel)}
            />

        </div>
    );
};

export default Edit;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/