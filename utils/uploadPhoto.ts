import { API_URL } from "@/context/constants";
import { toast } from "sonner";

export const uploadPhoto = async (
  file: File,
  token: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("attachment", file);

  try {
    const response = await fetch(`${API_URL}/images/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response)

    if (!response.ok) {
        toast.error("Failed to upload photo")
        return null
    }

    const result = await response.json();
    return result.fileUrl;
  } catch (error) {
    console.error("Photo upload error:", error);
    return null;
  }
};
