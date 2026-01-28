/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in kilometers
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Find offers near a location
 */
function findNearbyOffers(offers, userLat, userLon, radiusKm = 10) {
  const nearbyOffers = [];
  
  for (const offer of offers) {
    if (!offer.locations || offer.locations.length === 0) {
      continue;
    }
    
    // Check each location of the offer
    for (const location of offer.locations) {
      // Support both 'lng' and 'lon' property names
      const locationLon = location.lng || location.lon;
      
      if (location.lat && locationLon) {
        const distance = calculateDistance(
          userLat,
          userLon,
          location.lat,
          locationLon
        );
        
        if (distance <= radiusKm) {
          nearbyOffers.push({
            ...offer,
            distance: distance.toFixed(2),
            nearestLocation: location
          });
          break; // Only add offer once even if multiple locations are nearby
        }
      }
    }
  }
  
  // Sort by distance
  nearbyOffers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  
  return nearbyOffers;
}

/**
 * Group offers by location
 */
function groupOffersByLocation(offers) {
  const locationMap = new Map();
  
  for (const offer of offers) {
    if (!offer.locations || offer.locations.length === 0) {
      continue;
    }
    
    for (const location of offer.locations) {
      const key = `${location.name}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          name: location.name,
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          offers: []
        });
      }
      locationMap.get(key).offers.push(offer);
    }
  }
  
  return Array.from(locationMap.values());
}

module.exports = {
  calculateDistance,
  findNearbyOffers,
  groupOffersByLocation
};
