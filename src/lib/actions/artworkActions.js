"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


export async function getArtistArtworks(email) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artworks/${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch artworks");
    return await res.json();
  } catch (error) {
    console.error("Error in getArtistArtworks Action:", error);
    return { error: true, message: error.message };
  }
}

// new
export async function createArtwork(formData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artworks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to create artwork");
    return await res.json();
  } catch (error) {
    console.error("Error in createArtwork Action:", error);
    return { error: true, message: error.message };
  }
}

// update
export async function updateArtwork(id, formData) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artwork/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to update artwork");
    return await res.json();
  } catch (error) {
    console.error("Error in updateArtwork Action:", error);
    return { error: true, message: error.message };
  }
}

// 4.delete
export async function deleteArtwork(id) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artwork/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete artwork");
    return await res.json();
  } catch (error) {
    console.error("Error in deleteArtwork Action:", error);
    return { error: true, message: error.message };
  }
}

export async function getPublicArtworks(params = {}) {
  try {
    const { search = "", category = "", minPrice = "", maxPrice = "", sortBy = "" } = params;
    const queryString = new URLSearchParams({ search, category, minPrice, maxPrice, sortBy }).toString();
    
    const res = await fetch(`${BACKEND_URL}/api/public/artworks?${queryString}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load artworks");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}


export async function getSingleArtwork(id) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/artworks/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Artwork not found");
    }
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}