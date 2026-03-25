"use server"

export async function getGoogleMapsApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === "YOUR_API_KEY") {
    return { success: false, error: "Google Maps API key not configured" }
  }

  return { success: true, apiKey }
}
