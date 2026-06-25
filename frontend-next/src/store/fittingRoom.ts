import { create } from "zustand";
import axios from "axios";

type FittingRoomAPIResponse = {
    vertices: number[];
    faces: number[];
    n_vertices: number;
    n_faces: number;
};

type FittingRoomState = {
    fittingRoomData: FittingRoomAPIResponse | null;
    loading: boolean;
    error: string | null;
    fetchFittingRoomData: () => Promise<void>;
};

export const useFittingRoomStore = create<FittingRoomState>((set) => ({
    fittingRoomData: null as FittingRoomAPIResponse | null,
    loading: false,
    error: null,

    fetchFittingRoomData: async () => {
        set({ loading: true, error: null });
        
        try {
            const response = await axios.get<FittingRoomAPIResponse>("http://localhost:8001/smpl");
            console.log("Data from /fitting-room:", response.data);
            set({ fittingRoomData: response.data, loading: false });
        }
        catch {
            set({ loading: false, error: "Khong lay duoc du lieu tu /fitting-room" });
        }
    },
}));
