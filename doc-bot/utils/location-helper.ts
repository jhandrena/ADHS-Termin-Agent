export class LocationHelper {
  static async useCurrentLocation(): Promise<{ location: string; error: string | null }> {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
              const data = await response.json();
              const city = data.address.city || data.address.town || data.address.village || '';
              
              resolve({
                location: city,
                error: null
              });
            } catch (error) {
              console.error("Error fetching location data:", error);
              resolve({
                location: '',
                error: "Fehler beim Abrufen des Standorts. Bitte geben Sie ihn manuell ein."
              });
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            resolve({
              location: '',
              error: "Standortermittlung fehlgeschlagen. Bitte geben Sie ihn manuell ein."
            });
          }
        );
      } else {
        resolve({
          location: '',
          error: "Geolokalisierung wird von Ihrem Browser nicht unterstützt."
        });
      }
    });
  }
}
