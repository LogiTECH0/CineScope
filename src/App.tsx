import { useEffect, useState } from 'react'
import './App.css'
function App() {
  const API_KEY = import.meta.env.VITE_API_KEY as string;
  const [trendingPage, setTrendingPage] = useState(1);
  const [trending, setTrending] = useState<any[]>([]);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [trendingSPage, setTrendingSPage] = useState(1);
  const [trendingS, setTrendingS] = useState<any[]>([]);
  const [topRatedSPage, setTopRatedSPage] = useState(1);
  const [topRatedS, setTopRatedS] = useState<any[]>([]);
  const [nowPlayingSPage, setNowPlayingSPage] = useState(1);
  const [nowPlayingS, setNowPlayingS] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('movies-trending');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const fetchSearch = async (q: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${q}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results);
      }
    } catch {
      alert("Search error");
    }
  };
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSearch(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    const container = document.querySelector("main");
    const el = document.getElementById(sectionId);

    if (container && el) {
      const offsetTop = el.offsetTop;

      container.scrollTo({
        top: offsetTop - 20,
        behavior: "smooth",
      });
    }
  };
  const closeOverlay = () => setSelectedItem(null);
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${trendingPage}`);
      const data = await response.json();
      if (response.ok) {
        setTrending(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchTopRatedMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${topRatedPage}`);
      const data = await response.json();
      if (response.ok) {
        setTopRated(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchNowPlayingMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${nowPlayingPage}`);
      const data = await response.json();
      if (response.ok) {
        setNowPlaying(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchTrendingSeries = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${trendingSPage}`);
      const data = await response.json();
      if (response.ok) {
        setTrendingS(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchTopRatedSeries = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=${topRatedSPage}`);
      const data = await response.json();
      if (response.ok) {
        setTopRatedS(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchNowPlayingSeries = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&page=${nowPlayingSPage}`);
      const data = await response.json();
      if (response.ok) {
        setNowPlayingS(data.results)
      }
    } catch {
      alert("Error 501: Server doesnt respond")
    }
  }
  const fetchDetails = async (id: number, type: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`
    );
    const data = await res.json();
    setSelectedItem(data);
  };
  useEffect(() => {
    fetchTrendingMovies()
    fetchTopRatedMovies()
    fetchNowPlayingMovies()
  }, [trendingPage, topRatedPage, nowPlayingPage])
  useEffect(() => {
    fetchTrendingSeries()
    fetchTopRatedSeries()
    fetchNowPlayingSeries()
  }, [trendingSPage, topRatedSPage, nowPlayingSPage])
  return (
    <>
      <header>
        <div className="search">
          <input type="text"
            id="search"
            placeholder="Search movies, series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
          <button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </header>
      <div className="app">
        {query && (
          <div className="search-results">
            <h2>Search Results</h2>
            <div className="cards search-cards">
              {searchResults.map((item) => (
                <div key={item.id} className="movie-card" onClick={() =>
                  fetchDetails(item.id, item.media_type)
                }>
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/300x450"
                    }
                  />
                  <h3>{item.title || item.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
        <aside>
          <nav className="nav-menu">
            <h3>Movies</h3>
            <button
              className={activeSection === 'movies-trending' ? 'active' : ''}
              onClick={() => scrollToSection('movies-trending')}
            >Trending</button>
            <button
              className={activeSection === 'movies-top-rated' ? 'active' : ''}
              onClick={() => scrollToSection('movies-top-rated')}
            >Top Rated</button>
            <button
              className={activeSection === 'movies-now-playing' ? 'active' : ''}
              onClick={() => scrollToSection('movies-now-playing')}
            >Now Playing</button>
            <h3>Series</h3>
            <button
              className={activeSection === 'series-trending' ? 'active' : ''}
              onClick={() => scrollToSection('series-trending')}
            >Trending</button>
            <button
              className={activeSection === 'series-top-rated' ? 'active' : ''}
              onClick={() => scrollToSection('series-top-rated')}
            >Top Rated</button>
            <button
              className={activeSection === 'series-on-the-air' ? 'active' : ''}
              onClick={() => scrollToSection('series-on-the-air')}
            >On The Air</button>
          </nav>
        </aside>
        <main>
          <h1>CineVerse</h1>
          <h2 id="movies-trending">Trending</h2>
          <div className="cards movies trending">

            {trending.map((movie) => movie.original_language === "ru" ? null : (
              <div key={movie.id} className='movie-card' onClick={() => fetchDetails(movie.id, "movie")}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="No image available" />
                <h3>{movie.title}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{movie.vote_average}/10⭐</h4>
                    <h4 className="votes">{movie.vote_count}</h4>
                  </div>
                  <h4>{new Date(movie.release_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setTrendingPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {trendingPage}</p>
            <button onClick={() => setTrendingPage((prev) => prev + 1)}>Next Page</button>
          </div>
          <h2 id="movies-top-rated">Top Rated</h2>
          <div className="cards movies top-rated">

            {topRated.map((movie) => movie.original_language === "ru" ? null : (
              <div key={movie.id} className='movie-card' onClick={() => fetchDetails(movie.id, "movie")}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="No image available" />
                <h3>{movie.title}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{movie.vote_average}/10⭐</h4>
                    <h4 className="votes">{movie.vote_count}</h4>
                  </div>
                  <h4>{new Date(movie.release_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setTopRatedPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {topRatedPage}</p>
            <button onClick={() => setTopRatedPage((prev) => prev + 1)}>Next Page</button>
          </div>
          <h2 id="movies-now-playing">Now Playing</h2>
          <div className="cards movies now-playing">

            {nowPlaying.map((movie) => movie.original_language === "ru" ? null : (
              <div key={movie.id} className='movie-card' onClick={() => fetchDetails(movie.id, "movie")}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="No image available" />
                <h3>{movie.title}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{movie.vote_average}/10⭐</h4>
                    <h4 className="votes">{movie.vote_count}</h4>
                  </div>
                  <h4>{new Date(movie.release_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setNowPlayingPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {nowPlayingPage}</p>
            <button onClick={() => setNowPlayingPage((prev) => prev + 1)}>Next Page</button>
          </div>
          {/* <h2>Upcoming</h2>
          <h2 id="movies-upcoming">Upcoming</h2>
          <div className="cards movies coming">

            {coming.map((movie) => movie.original_language === "ru" ? null : (
              <div key={movie.id} className='movie-card'>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="No image available" />
                <h3>{movie.title}</h3>
                <div className="lower-info">
                  <h4>{new Date(movie.release_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setComingPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {comingPage}</p>
            <button onClick={() => setComingPage((prev) => prev + 1)}>Next Page</button>
          </div> */}
          <h2 className="title">Series</h2>
          <h2 id="series-trending" className="section-section">Trending</h2>
          <div className="cards series trending">

            {trendingS.map((show) => show.original_language === "ru" ? null : (
              <div key={show.id} className='movie-card' onClick={() => fetchDetails(show.id, "tv")}>
                <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt="No image available" />
                <h3>{show.name}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{show.vote_average}/10⭐</h4>
                    <h4 className="votes">{show.vote_count}</h4>
                  </div>
                  <h4>{new Date(show.first_air_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setTrendingSPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {trendingSPage}</p>
            <button onClick={() => setTrendingSPage((prev) => prev + 1)}>Next Page</button>
          </div>
          <h2 id="series-top-rated" className="section-section">Top Rated</h2>
          <div className="cards series trending">

            {topRatedS.map((show) => show.original_language === "ru" ? null : (
              <div key={show.id} className='movie-card' onClick={() => fetchDetails(show.id, "tv")}>
                <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt="No image available" />
                <h3>{show.name}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{show.vote_average}/10⭐</h4>
                    <h4 className="votes">{show.vote_count}</h4>
                  </div>
                  <h4>{new Date(show.first_air_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setTopRatedSPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {topRatedSPage}</p>
            <button onClick={() => setTopRatedSPage((prev) => prev + 1)}>Next Page</button>
          </div>
          <h2 id="series-on-the-air" className="section-section">On The Air</h2>
          <div className="cards series now-playing">

            {nowPlayingS.map((show) => show.original_language === "ru" ? null : (
              <div key={show.id} className='movie-card' onClick={() => fetchDetails(show.id, "tv")}>
                <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt="No image available" />
                <h3>{show.name}</h3>
                <div className="lower-info">
                  <div className="rate">
                    <h4 className="rating">{show.vote_average}/10⭐</h4>
                    <h4 className="votes">{show.vote_count}</h4>
                  </div>
                  <h4>{new Date(show.first_air_date).toLocaleDateString()}</h4>
                </div>
              </div>
            ))}

          </div>
          <div className="page-buttons">
            <button onClick={() => setNowPlayingSPage((prev) => prev === 1 ? prev : prev - 1)}>Previous Page</button>
            <p>Page {nowPlayingSPage}</p>
            <button onClick={() => setNowPlayingSPage((prev) => prev + 1)}>Next Page</button>
          </div>
        </main>
        {selectedItem && (
          <div className="overlay" onClick={closeOverlay}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>

              <img
                src={
                  selectedItem.poster_path
                    ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
                    : "https://via.placeholder.com/300x450"
                }
              />

              <div className="overlay-info">
                <h2>{selectedItem.title || selectedItem.name}</h2>

                <p>
                  {selectedItem.overview || "No description available"}
                </p>
                <p>{selectedItem.runtime ? `${Math.trunc(selectedItem.runtime / 60)} hours ${selectedItem.runtime % 60} minutes` : `Episodes: ${selectedItem.number_of_episodes} Seasons: ${selectedItem.number_of_seasons}`}</p>
                <p>{new Date(selectedItem.first_air_date || selectedItem.release_date).toLocaleDateString()}</p>
                <p>⭐ {selectedItem.vote_average}</p>
                <button onClick={() => window.open(selectedItem.homepage, '_blank')}>Visit The Official Website</button>
                <button onClick={closeOverlay}>Close</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
