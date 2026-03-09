import React, { useState, useEffect } from "react";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/listings");
      const data = await response.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Listings</h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading listings...
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          No listings found
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {listings.map((listing) => (
            <div
              key={listing._id}
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s",
              }}
            >
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={listing.image || "/images/placeholder.jpg"}
                  alt={listing.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "15px" }}>
                <h3 style={{ marginBottom: "5px" }}>{listing.title}</h3>
                <p style={{ color: "#666", marginBottom: "10px" }}>
                  {listing.location}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#667eea",
                    marginBottom: "15px",
                  }}
                >
                  ${listing.price} / night
                </p>
                <a
                  href={`/listings/${listing._id}`}
                  style={{
                    display: "inline-block",
                    background: "#667eea",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
