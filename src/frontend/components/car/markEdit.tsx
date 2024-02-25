import React, { useEffect, useState } from "react";
import { BasePropertyProps, Box, Label } from 'admin-bro';
import axios from "axios";
import Select from 'react-select';

const Edit: React.FC<BasePropertyProps> = ({ property, onChange, record }) => {
    const [marks, setMarks] = useState<{ _id: number; name: string, models: [string], aliases: [string] }[]>([]);
    const [models, setModels] = useState<string[]>([]);

    if (!record || !onChange) {
        return (
            <Box marginBottom="xxl">
                <Label>{property.label} | Error: Something went wrong!</Label>
            </Box>
        );
    }

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get("/api/marks");
                setMarks(response.data);
            } catch (error) {
                console.error("Error fetching marks:", error);
            }
        };

        fetchMarks();
    }, []);

    const parameter = record.params;
    const mark = (parameter.mark) ? parameter.mark : "Select...";
    const model = (parameter.model) ? parameter.model : "Select...";

    const handleMarkDropDownChange = (mark) => {
        setModels(mark.models);
        onChange("mark", mark.value);
        onChange("markAliases", mark.aliases);
        onChange("model", "");
    };
    const handleModelDropDownChange = (model) => {
        onChange("model", model.value);
    };


    const markOptions = marks.map((mark) => ({ value: mark.name, label: mark.name, models: mark.models, aliases: mark.aliases }));
    const modelOptions = models.map((model) => ({ value: model, label: model }));
    return (
        <div>
            <Label>Mark</Label>
            <Select
                value={{ value: mark, label: mark }}
                options={markOptions}
                onChange={(mark) => handleMarkDropDownChange(mark)}
            />
            <Label style={{ marginTop: 32 }}>Model</Label>
            <Select
                value={{ value: model, label: model }}
                options={modelOptions}
                onChange={(model) => handleModelDropDownChange(model)}
            />

        </div>
    );
};

export default Edit;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/