import { err, ok } from "neverthrow";
import { API_BASE_URL } from "./constant.ts";

export class FilesApiClient {
    static async removeFile(trackId: string) {
        const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/file`, {
            method: 'DELETE',
        });

        return response.ok ? ok() : err("Failed to delete track!");
    }

    static async uploadFile(trackId: string, file: Blob) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/tracks/` + trackId + "/upload", {
            method: "POST",
            body: formData,
        });

        return response.ok ? ok() : err("Error uploading track!");
    }

    static async fetchTrackAudio(fileName: string) {
        const response = await fetch(`${API_BASE_URL}/files/` + fileName);

        return response.ok ? ok(await response.blob()) : err("This track do not have file!");
    }
}
