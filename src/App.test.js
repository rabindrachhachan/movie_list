import { render, screen,  fireEvent, } from '@testing-library/react';
import App from './App';
import React from 'react';
import MovieGrid from './MovieGrid';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe('MovieGrid Component', () => {

  test('renders MovieGrid Component', () => {
    render(<MovieGrid />);;
    const headerElement = screen.getByText(/Romantic Comedy/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('Fetches and displays movies correctly', async () => {
    // Mock fetch response
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ page: { 'content-items': { content: [{ name: 'The Birds' }] } } }),
    });

    // Wait for movies to load
    const movieElement = await screen.findByText('The Birds');
    expect(movieElement).toBeInTheDocument();

    // Restore fetch mock
    global.fetch.mockRestore();
  });

  test('Handles search functionality', async () => {
    // Mock fetch response
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ page: { 'content-items': { content: [{ name: 'The Birds' }, { name: 'Rear Window' }] } } }),
    });
    
    // Simulate search input
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Rear Window' } });

    // Wait for movies to update with filtered results
    const filteredMovieElement = await screen.findByText('Rear Window');
    expect(filteredMovieElement).toBeInTheDocument();

    // Restore fetch mock
    global.fetch.mockRestore();
  });

  // Add more tests for intersection observer, highlightSearchTerm, etc.
});
