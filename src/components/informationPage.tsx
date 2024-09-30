// components/InfoPage.tsx
import { useQuery, gql } from '@apollo/client';
import { Box, Grid, Text, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ModalItem from './itemsdetailsmodal';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const GET_CHARACTERS = gql`
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

const InfoPage = () => {
  const router = useRouter();
  const { page } = router.query; // Read the page from the URL
  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  // Update the current page based on the router query param
  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Update the URL without reloading the page
    router.push({ pathname: '/info', query: { page: newPage } }, undefined, { shallow: true });
  };

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  if (loading) return <Spinner size="xl" label="Loading characters..." />;
  if (error) return (
    <Alert status="error">
      <AlertIcon />
      Error: {error.message}
    </Alert>
  );

  const { results, info } = data.characters;

  return (
    <Box p="10px" mt="20px">
      {/* Display current page info */}
      <Text mb="4" data-test-id="page-info">Page {currentPage} of {info.pages}</Text>

      {/* Character Grid */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {results.map((character: any) => (
          <Box
            key={character.id}
            onClick={() => setSelectedCharacter(character)}
            tabIndex={0}
            role="button"
            aria-label={`Open modal for ${character.name}`}
            onKeyPress={(e) => e.key === 'Enter' && setSelectedCharacter(character)}
          >
            <Image width="400" height="400" src={character.image} alt={character.name} priority />
            <Text>{character.name}</Text>
          </Box>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box mt="4" display="flex" justifyContent="space-between">
        <Button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          data-test-id="previous-button"
          aria-label="Go to previous page"
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= info.pages}
          data-test-id="next-button"
          aria-label="Go to next page"
        >
          Next
        </Button>
      </Box>

      {/* Modal for selected character */}
      {selectedCharacter && (
        <ModalItem character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
      )}
    </Box>
  );
};

export default InfoPage;
