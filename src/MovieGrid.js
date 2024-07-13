import React, { useEffect, useState,useRef } from 'react';
import Header from './Header';
import LazyImage from './LazyImage';
import './MovieGrid.css';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef(null);

  // Function to fetch movies
  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`https://test.create.diagnal.com/data/page${page}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies((prevMovies) => [...prevMovies, ...data.page['content-items'].content]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // Function to handle loading more movies
  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };


    // Setup IntersectionObserver to load more movies when the "Load More" button comes into view
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreMovies();
          }
        },
        { threshold: 1.0 }
      );
  
      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }
  
      return () => {
        if (loadMoreRef.current) {
          observer.unobserve(loadMoreRef.current);
        }
      };
    }, [loadMoreRef.current]);

  // Filtered movies based on search query
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header onSearch={(query) => setSearchQuery(query)} />
      <div className="movie-grid">
        {filteredMovies.map((movie, index) => (
          <div className="movie-item" key={index}>
            {/* Lazy loading image setup */}
            <LazyImage
              src={`https://test.create.diagnal.com/images/${movie['poster-image']??'placeholder_for_missing_posters.png'}`}
              alt={movie.name}
            />
            <h3>{movie.name}</h3>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <div ref={loadMoreRef} style={{ height: '20px' }} />
    </div>
  );
};

export default MovieGrid;
