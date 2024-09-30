// __tests__/BlockingElement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlockingElement from '../src/components/userModal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom'; // for additional matchers

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('BlockingElement Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock the router's push function
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Clear cookies and mocks before each test
    (Cookies.get as jest.Mock).mockClear();
    (Cookies.set as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  test('renders the input form when no cookies are present', () => {
    render(<BlockingElement />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('loads username and jobTitle from cookies if available', () => {
    // Mock cookies to simulate previously entered details
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'username') return 'John Doe';
      if (key === 'jobTitle') return 'Software Engineer';
      return null;
    });

    render(<BlockingElement />);

    // Ensure welcome message is displayed
    expect(screen.getByText('Welcome, John Doe! Your job title is Software Engineer.')).toBeInTheDocument();
  });

  test('allows users to submit the form and saves the details in cookies', async () => {
    (Cookies.get as jest.Mock).mockImplementation((key) => {

      return null;
    });
    render(<BlockingElement />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const jobTitleInput = screen.getByPlaceholderText('Job Title');
    const submitButton = screen.getByText('Submit');

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'John Doe' } });
    fireEvent.change(jobTitleInput, { target: { value: 'Software Engineer' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Expect the cookies to be set
    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith('username', 'John Doe', { expires: 7 });
      expect(Cookies.set).toHaveBeenCalledWith('jobTitle', 'Software Engineer', { expires: 7 });
    });

    // Ensure welcome message is displayed after submission
    expect(screen.getByText('Welcome, John Doe! Your job title is Software Engineer.')).toBeInTheDocument();
  });

  test('allows users to edit the submitted information', async () => {
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'username') return 'John Doe';
      if (key === 'jobTitle') return 'Software Engineer';
      return null;
    });

    render(<BlockingElement />);

    // Ensure welcome message is displayed
    expect(screen.getByText('Welcome, John Doe! Your job title is Software Engineer.')).toBeInTheDocument();

    // Click "Edit Information" button
    fireEvent.click(screen.getByText('Edit Information'));

    // Ensure form is rendered again
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Job Title')).toBeInTheDocument();
    });
  });

  test('navigates to the /info page when the Continue button is clicked', async () => {
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'username') return 'John Doe';
      if (key === 'jobTitle') return 'Software Engineer';
      return null;
    });

    render(<BlockingElement />);

    // Ensure welcome message is displayed
    expect(screen.getByText('Welcome, John Doe! Your job title is Software Engineer.')).toBeInTheDocument();

    // Click "Continue" button
    fireEvent.click(screen.getByText('Continue'));

    // Ensure router.push is called with the correct path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/info');
    });
  });

  test('submit button is disabled if username or job title is missing', () => {
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      return null;
    });
    render(<BlockingElement />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const jobTitleInput = screen.getByPlaceholderText('Job Title');
    const submitButton = screen.getByText('Submit');

    // Initially, submit button should be disabled
    expect(submitButton).toBeDisabled();

    // Enter username only
    fireEvent.change(usernameInput, { target: { value: 'John Doe' } });
    expect(submitButton).toBeDisabled();

    // Enter job title as well
    fireEvent.change(jobTitleInput, { target: { value: 'Software Engineer' } });
    expect(submitButton).not.toBeDisabled();
  });
});
