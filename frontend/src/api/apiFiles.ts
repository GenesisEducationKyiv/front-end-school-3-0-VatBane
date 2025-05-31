import {API_BASE_URL} from "./constant.ts";

export const removeFile = async (trackId: string) => {
    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/file`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        alert("Failed to delete track!")
        console.log(await response.json())
        return
    }
}

export const uploadFile = async (trackId: string, file: File) => {
    // packing and sending request
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/tracks/` + trackId + "/upload", {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        alert("Error uploading track!")
        return;
    }

    return true;
}

export const fetchTrackAudio = async (fileName: string) => {
    const response = await fetch(`${API_BASE_URL}/files/` + fileName);
    if (response.status < 200 || response.status > 299) {
        alert("This track do not have file!")
        return;
    }
    return await response.blob();
}
