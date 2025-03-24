import { Storage } from "@ionic/storage";

const storage = new Storage();
storage.create();

export const saveData = async (key: string, value: any) => {
    await storage.set(key, value);
};

export const getData = async (key: string) => {
    return await storage.get(key);
};
