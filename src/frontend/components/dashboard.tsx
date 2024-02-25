import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import axios from "axios";

interface VisitorData {
    month: { [date: string]: number },
    year: { [month: string]: number },
}

const Dashboard: React.FC = () => {
    const [visitorData, setVisitorData] = useState<VisitorData>({ month: {}, year: {} });

    useEffect(() => {
        // Fetch visitor count data from the server
        axios.get("/api/visitors").then((response) => {
            const filledVisitorData = fillMissingDays(response.data.month, 30);
            const last12MonthsVisitorData = fillMissingMonths(response.data.year, 12);
            setVisitorData({ month: filledVisitorData, year: last12MonthsVisitorData });
        });
    }, []);

    // Function to fill missing days in the month with 0 visitors
    const fillMissingDays = (data: { [date: string]: number }, numDays: number) => {
        const currentDate = new Date();
        const filledData = {};
        for (let i = numDays - 1; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            const formattedDate = formatDate(date);
            filledData[formattedDate] = data[formattedDate] || 0;
        }
        return filledData;
    };

    // Function to fill missing months in the year with 0 visitors
    // Function to fill missing months in the year with 0 visitors
    const fillMissingMonths = (data: { [month: string]: number }, numMonths: number) => {
        const currentDate = new Date();
        const filledData = {};

        // Calculate the starting month and year
        let startMonth = currentDate.getMonth() - numMonths + 1;
        let startYear = currentDate.getFullYear();

        // If the starting month is negative, adjust it and the year accordingly
        if (startMonth < 0) {
            startMonth += 12;
            startYear -= 1;
        }

        for (let i = 0; i < numMonths; i++) {
            const month = startMonth + i;
            const year = startYear + Math.floor(month / 12);
            const formattedMonth = formatMonth(month % 12, year);

            // Ensure the month format is consistent (e.g., "01" instead of "1")
            const paddedMonth = String(month % 12 + 1).padStart(2, "0");
            const formattedYear = String(year);
            const formattedKey = `${paddedMonth}.${formattedYear}`;
            filledData[formattedKey] = data[formattedKey] || 0;
        }
        return filledData;
    };


    // Helper function to format date as "dd.mm"
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${day}.${month}`;
    };

    // Helper function to format month as "MMM yyyy" (e.g., "Jul 2023")
    const formatMonth = (month: number, year: number) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[month]} ${year}`;
    };

    return (
        <div>
            {Object.keys(visitorData.month).length > 0 && (
                <ResponsiveContainer width="95%" height={600}>
                    <LineChart data={Object.entries(visitorData.month).map(([date, visitors]) => ({ date, visitors }))}
                        margin={{ top: 50 }}>
                        <CartesianGrid strokeDasharray="0 3" />
                        <XAxis dataKey="date" tickCount={5} tickFormatter={(value: string) => value.slice(0, 5)} />
                        <YAxis domain={[0, "dataMax"]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="visitors" stroke="rgba(54, 162, 235, 1)"
                            fill="rgba(54, 162, 235, 0.2)" />
                    </LineChart>
                </ResponsiveContainer>
            )}
            {Object.keys(visitorData.year).length > 0 && (
                <ResponsiveContainer width="95%" height={600}>
                    <BarChart data={Object.entries(visitorData.year).map(([month, visitors]) => ({ month, visitors }))}
                        margin={{ top: 50 }}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visitors" fill="rgba(235, 54, 54, 0.2)" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default Dashboard;
