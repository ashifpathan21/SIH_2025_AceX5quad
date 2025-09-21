export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "smartpravesh");
  formData.append("cloud_name", "dmi1zvsrt");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmi1zvsrt/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data?.error?.message || "Upload failed");
    }
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err.message);
    throw err;
  }
};
