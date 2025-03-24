import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Stop, StopInfo} from "../types";
import axios from "axios";
import {saveData, getData} from "./storage";

const baseApi: string = import.meta.env.VITE_BASE_API;

type StorageData = {
    stops: Stop[];
    stopsDetails: Record<string, StopInfo>;
}

interface StorageContextType {
    data: StorageData;
    updateData: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const fetchStops = async () => {
    const res = await axios.get(`${baseApi}/stops`);
    return res.data;
}

const fetchStopsDetails = async () => {
    const res = await axios.get(`${baseApi}/stopsDetails`);
    return res.data;
}

const fetchAllStops = async (): Promise<StorageData> => {
    const stops = fetchStops();
    const stopsDetails = fetchStopsDetails();

    return await Promise.all([stops, stopsDetails]).then(([stops, stopsDetails]) => {
        return {stops, stopsDetails};
    });
}

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
};

export const StorageProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [data, setData] = useState<StorageData>();

    const updateData = async () => {
        const data = await fetchAllStops();
        setData(data);
        await saveData("stopsData", data);
    };

    useEffect(() => {
        const loadStoredData = async () => {
            const storedData = await getData("stopsData");
            if (storedData) {
                setData(storedData);
            } else {
                await updateData();
            }
        };
        loadStoredData();
    }, []);

    if (data) {
        return (
            <StorageContext.Provider value={{data, updateData}}>
                {children}
            </StorageContext.Provider>
        );
    }
};