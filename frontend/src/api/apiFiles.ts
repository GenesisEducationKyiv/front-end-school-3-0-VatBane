import { ok, err } from "neverthrow";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const removeFile = async (trackId: string) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/file`, {
        method: "DELETE",
    });

    return response.ok ? ok("Track deleted successfully!") : err(`Failed to delete track ${trackId}`);
};

export const uploadFile = async (trackId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/tracks/` + trackId + "/upload",
        {
            method: "POST",
            body: formData,
        },
    );

    return response.ok ? ok('Track uploaded successfully!') : err(`Failed to upload track ${trackId}`);
};

export const fetchTrackAudio = async (fileName: string) => {
    const response = await fetch(`${API_BASE_URL}/files/` + fileName);

    return response.ok ? ok(await response.blob()) : err(`Could not fetch track ${fileName}`)
};
