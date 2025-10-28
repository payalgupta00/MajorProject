const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const address = typeof listingLocation !== "undefined" ? listingLocation : "India Gate, New Delhi";


fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      const { lat, lon } = data[0];
      L.marker([lat, lon]).addTo(map)
        .bindPopup(`${address}<br>Lat: ${lat}, Lon: ${lon}`)
        .openPopup();
      map.setView([lat, lon], 14);
    } else {
      alert("Location not found!");
    }
  })
  .catch(err => console.error(err));

// ✅ Add this after the fetch block:
map.on('click', function(e) {
  const { lat, lng } = e.latlng;

  // Add marker where user clicked
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`You clicked here:<br>Lat: ${lat}<br>Lng: ${lng}`)
    .openPopup();
});
