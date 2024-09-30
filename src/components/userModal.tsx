// components/BlockingElement.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Input, Stack, Text, Center } from '@chakra-ui/react';
import Cookies from 'js-cookie'; // Use js-cookie to set cookies
import { useRouter } from 'next/router';

const BlockingElement = () => {
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();


  // Load username and jobTitle from cookies
  useEffect(() => {
    const savedUsername = Cookies.get('username');
    const savedJobTitle = Cookies.get('jobTitle');
    if (savedUsername && savedJobTitle) {
      setUsername(savedUsername);
      setJobTitle(savedJobTitle);
      setIsSubmitted(true);
    }
  }, []);

  // Handle form submission and save details in cookies
  const handleSubmit = () => {
    if (username && jobTitle) {
      Cookies.set('username', username, { expires: 7 });
      Cookies.set('jobTitle', jobTitle, { expires: 7 });
      setIsSubmitted(true);
      // onContinue()
    }
  };

  const onContinue = () => {
    router.push('/info'); // Allow user to proceed

  }
 
  if (isSubmitted) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Text fontSize="xl" mb={4}>
            Welcome, {username}! Your job title is {jobTitle}.
          </Text>
          <Button onClick={() => setIsSubmitted(false)} colorScheme="teal">
            Edit Information
          </Button>
          <Button onClick={onContinue} colorScheme="blue" ml={3}>
            Continue
          </Button>
        </Box>
      </Center>
    );
  }

  return (
    <Center height="100vh">
      <Box>
        <Text fontSize="xl" mb={4} textAlign="center">
          Please enter your details to continue:
        </Text>
        <Stack spacing={4} align="center">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="md"
          />
          <Input
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            size="md"
          />
          <Button onClick={handleSubmit} colorScheme="teal" isDisabled={!username || !jobTitle}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default BlockingElement;
