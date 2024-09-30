# Next.js TypeScript Project with Apollo Client and Chakra UI

This project is a Next.js application built with TypeScript that utilizes Apollo Client for GraphQL data fetching and Chakra UI for responsive design. The application features a modal for user input and displays a paginated list of characters fetched from a public GraphQL API.

## Features

- **Responsive Design**: Fully responsive for both mobile and desktop views using Chakra UI.
- **User Input Modal**: A modal collects the username and job title from the user, which is stored and displayed.
- **GraphQL Data Fetching**: Uses Apollo Client to query a public GraphQL API (Rick and Morty API) and displays character information, including images.
- **Pagination**: Character data is displayed as a paginated list, and users can navigate between pages.
- **Direct Linking**: Users can link directly to specific pages of paginated data via URL.
- **Modal Detail View**: Clicking on a character opens a modal that displays more detailed information.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

2. Install the dependencies:
    ```bash 
    npm install

3. Run the development server:
    ```bash 
    npm run dev

4. Open your browser and navigate to [link]http://localhost:3000.

### Usage
1. User Input: Upon visiting the page, a modal will appear, prompting the user to enter their username and job title. This information will be stored for future sessions.
2. View Characters: After submitting the modal, the user can view a list of characters from the API.
3. Pagination: Use the "Next" and "Previous" buttons to navigate between pages of characters.
4. Character Details: Click on a character to open a modal with more details about that character.


### Technologies Used
* Next.js
* TypeScript
* Apollo Client
* Chakra UI
* Jest (for unit testing)
* Playwright (for end-to-end testing)

### Testing
### Unit Testing

To run unit tests, use the following command:
    

        npm run test:unit

### E2E Testing
To run end-to-end tests using Playwright, use:

        npm run test:e2e


### Deployment
This application can be deployed easily using Vercel. To deploy:

1. Push your code to a GitHub repository.
2. Go to Vercel and sign in.
3. Import your project from GitHub.
4. Follow the prompts to deploy.


### Code Documentation
### Components
[components/InfoPage.tsx](components/InfoPage.tsx)
This component displays a paginated list of characters fetched from the Rick and Morty API.

``` tsx
import { useQuery, gql } from '@apollo/client';
import { Box, Grid, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ModalItem from './itemsdetailsmodal';
import Image from 'next/image';
import { useRouter } from 'next/router';

// GraphQL query to get characters
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        count
        pages
      }
      results {
        id
        name
        image
      }
    }
  }
`;

// InfoPage component for displaying paginated list of characters
const InfoPage = () => {
  const router = useRouter();
  const { page } = router.query; // Read the page from the URL
  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push({
      pathname: '/info',
      query: { page: newPage },
    }, undefined, { shallow: true }); // shallow routing avoids a full page reload
  };

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { results } = data.characters;

  return (
    <Box p="10px" mt="20px">
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {results.map((character: any) => (
          <Box key={character.id} onClick={() => setSelectedCharacter(character)}>
            <Image width="400" height="400" src={character.image} alt={character.name} priority/>
            <Text>{character.name}</Text>
          </Box>
        ))}
      </Grid>

      {/* Pagination Controls */}
      {currentPage !== 1 && (
        <Button mt="4" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}>
          Previous
        </Button>
      )}
      <Button mt="4" ml="2" onClick={() => handlePageChange(currentPage + 1)}>
        Next
      </Button>

      {/* Modal for selected character */}
      {selectedCharacter && (
        <ModalItem character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
      )}
    </Box>
  );
};

export default InfoPage;
```

### Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgments
* Next.js
* Apollo Client
* Chakra UI
* Rick and Morty API

### Customization

Feel free to update any placeholders (like the GitHub repository URL) and add any additional sections as needed. This `README.md` provides a comprehensive overview of your project, making it easier for others to understand how to set it up and use it effectively.