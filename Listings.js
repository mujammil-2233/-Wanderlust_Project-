import React, { useState, useEffect } from "react";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/listings?${queryParams}`);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryClick = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: category === filters.category ? "" : category,
    }));
  };

  return (
    <div className="listings-container">
      {/* Filter Bar */}
      <div className="filter-bar-container">
        <div className="filter-bar-wrapper">
          <div className="filter-categories">
            {[
              { key: "", icon: "fas fa-th", label: "All" },
              {
                key: "amazing-views",
                icon: "fas fa-mountain",
                label: "Amazing views",
              },
              {
                key: "beachfront",
                icon: "fas fa-umbrella-beach",
                label: "Beachfront",
              },
              { key: "cabins", icon: "fas fa-home", label: "Cabins" },
              { key: "countryside", icon: "fas fa-tree", label: "Countryside" },
              { key: "design", icon: "fas fa-pencil-ruler", label: "Design" },
              { key: "luxury", icon: "fas fa-gem", label: "Luxury" },
              { key: "mansions", icon: "fas fa-building", label: "Mansions" },
              { key: "boats", icon: "fas fa-ship", label: "Boats" },
              { key: "trending", icon: "fas fa-fire", label: "Trending" },
            ].map((cat) => (
              <button
                key={cat.key}
                className={`filter-category ${filters.category === cat.key ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.key)}
              >
                <i className={cat.icon}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
          <button
            className="filter-button"
            onClick={() => {
              /* toggle modal */
            }}
          >
            <i className="fas fa-sliders-h"></i>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-group">
          <input
            type="text"
            name="search"
            placeholder="Search destinations"
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="listings-grid">
        {loading ? (
          <div className="loading">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="no-listings">No listings found</div>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              <div className="listing-image">
                <img
                  src={listing.image || "/images/placeholder.jpg"}
                  alt={listing.title}
                />
                <button
                  className="favorite-btn"
                  onClick={() => {
                    /* toggle favorite */
                  }}
                >
                  <i className="far fa-heart"></i>
                </button>
              </div>
              <div className="listing-content">
                <h3 className="listing-title">{listing.title}</h3>
                <p className="listing-location">{listing.location}</p>
                <p className="listing-price">${listing.price} / night</p>
                <a href={`/listings/${listing._id}`} className="view-btn">
                  View Details
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .listings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .filter-bar-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .filter-categories {
          display: flex;
          gap: 10px;
          padding: 15px;
        }

        .filter-category {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          background: #f8f9fa;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 80px;
        }

        .filter-category:hover,
        .filter-category.active {
          background: #667eea;
          color: white;
        }

        .filter-category i {
          font-size: 20px;
          margin-bottom: 5px;
        }

        .search-bar {
          margin-bottom: 30px;
        }

        .search-input-group {
          display: flex;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 25px 0 0 25px;
          font-size: 16px;
        }

        .search-btn {
          padding: 12px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 0 25px 25px 0;
          cursor: pointer;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .listing-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s;
        }

        .listing-card:hover {
          transform: translateY(-5px);
        }

        .listing-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .favorite-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .listing-content {
          padding: 15px;
        }

        .listing-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .listing-location {
          color: #666;
          margin-bottom: 10px;
        }

        .listing-price {
          font-weight: bold;
          color: #667eea;
          margin-bottom: 15px;
        }

        .view-btn {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 500;
        }

        .loading,
        .no-listings {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ListingsPage;
