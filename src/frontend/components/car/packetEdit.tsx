import React, { useEffect, useState } from "react";
import { BasePropertyProps, Box, Label } from "admin-bro";
import axios from "axios";
import Select from "react-select";

const Edit: React.FC<BasePropertyProps> = ({ property, onChange, record }) => {
    const [packets, setPackets] = useState<{ days: number; _id: string }[]>([]);

    useEffect(() => {
        const fetchPackets = async () => {
            try {
                const response = await axios.get("/api/packets");
                setPackets(response.data);
            } catch (error) {
                console.error("Error fetching packets:", error);
                // You can add additional error handling here, like displaying an error message.
            }
        };

        fetchPackets();
    }, []);

    if (!record || !onChange) {
        return (
            <Box marginBottom="xxl">
                <Label>
                    {property.label} | Error: Something went wrong or the provided props
                    are invalid!
                </Label>
            </Box>
        );
    }

    const parameters = record.params;
    const currentPackets = Object.keys(parameters)
        .filter((key) => key.startsWith("packets."))
        .map((key) => parameters[key]);

    const handlePacketsDropDownChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map((option) => option.id);
        onChange(property.name, selectedIds);
    };

    const packetValues = packets
        .filter((packet) => currentPackets.includes(packet._id))
        .map((packet) => ({
            value: `${packet.days}-Day Rental`,
            id: packet._id,
            label: `${packet.days}-Day Rental`,
        }));

    const packetOptions = packets.map((packet) => ({
        value: `${packet.days}-Day Rental`,
        id: packet._id,
        label: `${packet.days}-Day Rental`,
    }));

    return (
        <div style={{ marginTop: 32 }}>
            <Label>Packets</Label>
            <Select
                isMulti
                options={packetOptions}
                value={packetValues}
                onChange={handlePacketsDropDownChange}
            />
        </div>
    );
};

export default Edit;
