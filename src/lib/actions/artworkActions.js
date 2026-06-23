"use server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;

export async function getArtistArtworks(email, token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artist/artworks/${email}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch artworks");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function createArtwork(formData, token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artworks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to create artwork");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function updateArtwork(id, formData, token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artwork/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to update artwork");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function deleteArtwork(id, token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/artist/artworks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete artwork");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export async function getPublicArtworks(params = {}) {
  try {
    const { search = "", category = "", minPrice = "", maxPrice = "", sortBy = "" } = params;
    const queryString = new URLSearchParams({
      search, category, minPrice, maxPrice, sortBy,
    }).toString();
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
    if (!res.ok) throw new Error("Artwork not found");
    return await res.json();
  } catch (error) {
    return { error: true, message: error.message };
  }
}