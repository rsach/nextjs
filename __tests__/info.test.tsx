import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InfoPage from '../src/components/informationPage';
import { MockedProvider } from '@apollo/client/testing';
import { GET_CHARACTERS } from '../src/components/informationPage';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import rick from './images/rick.webp'
import morty from './images/morty.webp'


// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocked GraphQL response for Apollo Client
const mocks = [
  {
    request: {
      query: GET_CHARACTERS,
      variables: { page: 1 },
    },
    result: {
      data: {
        characters: {
          info: {
            count: 100,
            pages: 10,
          },
          results: [
            { id: '1', name: 'Rick Sanchez', image: rick },
            { id: '2', name: 'Morty Smith', image: morty },
          ],
        },
      },
    },
  },
];

describe('InfoPage Component', () => {
  beforeEach(() => {
    // Mock router's query param to simulate the URL query page parameter
    (useRouter as jest.Mock).mockReturnValue({
      query: { page: '1' },
      push: jest.fn(),
    });
  });

  test('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <InfoPage />
      </MockedProvider>
    );

    // Check if loading text is displayed
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  test('renders character list after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InfoPage />
      </MockedProvider>
    );

    // Wait for characters to appear
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    // Check if images are displayed
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);
    
  });

  test('handles page change correctly', async () => {
    const router = useRouter();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InfoPage />
      </MockedProvider>
    );

    // Wait for the next button to appear
    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    // Simulate click on the "Next" button
    fireEvent.click(screen.getByText('Next'));

    // Ensure that router.push was called with the correct new page number
    expect(router.push).toHaveBeenCalledWith(
      { pathname: '/info', query: { page: 2 } },
      undefined,
      { shallow: true }
    );
  });

  test('displays error message when GraphQL query fails', async () => {
    const errorMock = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        error: new Error('Failed to fetch data'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <InfoPage />
      </MockedProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument();
    });
  });
});

