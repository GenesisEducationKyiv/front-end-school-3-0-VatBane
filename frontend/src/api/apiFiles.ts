import {API_BASE_URL} from "./constant.ts";
import {Result, ok, err} from "neverthrow";


export const removeFile = async (trackId: string) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/file`, {
        method: "DELETE",
    });

    return response.ok ? ok("Track deleted successfully!") : err(`Failed to delete track ${trackId}`);
};

export const uploadFile = async (trackId: string, file: File) => {
    // packing and sending request
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/tracks/` + trackId + "/upload",
        {
            method: "POST",
            body: formData,
        },
    );

    if (!response.ok) {
        alert("Error uploading track!");
        return false;
    }

    return true;
};

export const fetchTrackAudio = async (fileName: string) => {
    const response = await fetch(`${API_BASE_URL}/files/` + fileName);
    if (response.status < 200 || response.status > 299) {
        alert("This track do not have file!");
        return err(new Error(`Could not fetch track ${fileName}`));
    }
    return ok(await response.blob());
};
