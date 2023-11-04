import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchResults from './search_results.jsx';
import { fetchTrainingLibraries, searchTrainingLibraries } from '../../actions/training_actions';

const TrainingLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const focusedLibrarySlug = useSelector(state => state.training.focusedLibrarySlug);
  const [search, setSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrainingLibraries())
      .then((data) => {
        setLibraries(data.data.libraries);
        setIsLoading(false);
      });
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      dispatch(searchTrainingLibraries(search))
        .then((data) => {
          setSlides(data.data);
          setShowSearchResults(true);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading__spinner" />
      </div>
    );
  }
  if (libraries.length === 0) {
    if (Features.wikiEd) {
      return (
        <div>
          <p
            dangerouslySetInnerHTML={{
              __html: I18n.t('training.no_training_library_records_wiki_ed_mode', {
                url: '/reload_trainings?module=all',
              }),
            }}
          />
        </div>
      );
    }

    return (
      <div>
        {I18n.t('training.no_training_library_records_non_wiki_ed_mode')}
      </div>
    );
  }
  return (
    <div>
      <h1>Training Libraries</h1>
      <div className="search-bar" style={{ position: 'relative' }}>
        <form onClick={handleSubmit} acceptCharset="UTF-8" method="get">
          <input name="utf8" type="hidden" defaultValue="✓" />
          <input
            type="text"
            value={search}
            id="search_training"
            name="search_training"
            onChange={e => handleSearch(e)}
            placeholder= {I18n.t('training.search_training_resources')}
            style={{ width: '100%', height: '3rem', fontSize: '15px' }}
          />
          <button type="submit" id="training_search_button" style={{ position: 'absolute', right: '20px', top: '10px' }}>
            <i className="icon icon-search" />
          </button>
        </form>
      </div>
      {showSearchResults ? (
        <SearchResults slides={slides} message={I18n.t('training.no_training_resource_match_your_search')} />
      ) : (
        <ul className="training-libraries no-bullets no-margin">
          {libraries
            .filter(library => !library.exclude_from_index)
            .map((library, index) => {
              const isFocused = focusedLibrarySlug === library.slug;
              let libraryClass = 'training-libraries__individual-library no-left-margin';
              if (isFocused) {
                libraryClass += ' training-library-focus';
              } else if (focusedLibrarySlug) {
                libraryClass += ' training-library-defocus';
              }

              return (
                <li key={index} className={libraryClass}>
                  <a href={`/training/${library.slug}`} className="action-card action-card-index">
                    <header className="action-card-header">
                      <h3 className="action-card-title">{library.name}</h3>
                      <span className="icon-container">
                        <i className="action-card-icon icon icon-rt_arrow" />
                      </span>
                    </header>
                  </a>
                  <div className="action-card-text">
                    <h3>Included Modules:</h3>
                    <ul>
                      {library.categories.map(category =>
                        category.modules.map((trainingModule, moduleIndex) => (
                          <li key={moduleIndex}>
                            <a href={`/training/${library.slug}/${trainingModule.slug}`} target="_blank">
                              {trainingModule.name}
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default TrainingLibraries;
