export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000 // allow cached coordinates up to 1 minute
        };

        const tryLowAccuracy = () => {
            console.log("High accuracy geolocation timed out or failed, falling back to low accuracy...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 300000 // allow up to 5 minutes cached coordinates
                }
            );
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                // If high accuracy times out or position is unavailable, try low accuracy fallback
                if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
                    tryLowAccuracy();
                } else {
                    reject(error);
                }
            },
            options
        );
    });
}