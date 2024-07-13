import React, { useEffect, useState,useRef } from 'react';
import Header from './Header';
import LazyImage from './LazyImage';
import './MovieGrid.css';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);
  const [query,setQuery] = useState('')
  const [filteredMovies, setFilteredMovies] = useState([]);

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

      const filteredData = [...data.page['content-items'].content].filter((movie) =>
        movie?.name?.toLowerCase().includes(query?.toLowerCase())
      );
      setFilteredMovies((prevMovies) => [...prevMovies, ...filteredData])

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

    const handleSearch =(query)=>{
        // Filtered movies based on search query
        if(query){
          const filteredMovies = movies.filter((movie) =>
            movie.name.toLowerCase().includes(query.toLowerCase())
          );
          setQuery(query)
          setFilteredMovies(filteredMovies)
        }else{
          setFilteredMovies(movies)
          setQuery('')
        }
    }

    const highlightSearchTerm = (name) => {
      if(query.trimEnd().length ){
        const regex = new RegExp(`(${query})`, 'gi'); // Case insensitive match
        return name.replace(regex, '<mark>$1</mark>'); // Wrap matched text in <mark> tags for highlighting
      }
      return name
    
    };
  

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div className="movie-grid">
        {filteredMovies.map((movie, index) => (
          <div className="movie-item" key={index}>
            {/* Lazy loading image setup */}
            <LazyImage
              src={`https://test.create.diagnal.com/images/${movie['poster-image']??'placeholder_for_missing_posters.png'}`}
              alt={movie.name}
            />
            <h3 dangerouslySetInnerHTML={{ __html: highlightSearchTerm(movie.name) }}></h3>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <div ref={loadMoreRef} style={{ height: '20px' }} />
    </div>
  );
};

export default MovieGrid;
