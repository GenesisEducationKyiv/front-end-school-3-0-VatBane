import { API_BASE_URL } from "./constant.ts";

export class FilesApiClient {
    static async removeFile(trackId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/file`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            alert("Failed to delete track!")
            console.log(await response.json())
            return
        }
    }

    static async uploadFile(trackId: string, file: any): Promise<boolean | undefined> {
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

    static async fetchTrackAudio(fileName: string): Promise<Blob | undefined> {
        const response = await fetch(`${API_BASE_URL}/files/` + fileName);
        if (response.status < 200 || response.status > 299) {
            alert("This track do not have file!")
            return;
        }
        return await response.blob();
    }
}