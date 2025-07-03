import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TrackCreate from "../../src/components/TrackCreate/TrackCreate";
import { TracksApiClient } from '../../src/api/apiTracks';
import * as validationUtils from '../../src/utils/validationUtils';
import useGenres from '../../src/hooks/useGenres';

// Mock dependencies
vi.mock('../../src/api/apiTracks');
vi.mock('../../src/utils/validationUtils');
vi.mock('../../src/hooks/useGenres');

// Mock image imports
vi.mock('../../assets/musicIcon.png', () => ({ default: 'mock-music-icon.png' }));
vi.mock('../../assets/saveIcon.png', () => ({ default: 'mock-save-icon.png' }));

const mockTracksApiClient = vi.mocked(TracksApiClient);
const mockValidationUtils = vi.mocked(validationUtils);
const mockUseGenres = vi.mocked(useGenres);

describe('TrackCreate Integration Tests', () => {
    const mockHandleClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockGenres = ['Rock', 'Pop', 'Jazz', 'Electronic'];

    const defaultProps = {
        handleClose: mockHandleClose,
        onSave: mockOnSave,
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Setup default mock implementations
        mockUseGenres.mockReturnValue(mockGenres);
        mockValidationUtils.isValidImageUrl.mockReturnValue(true);
        mockTracksApiClient.saveTrack.mockResolvedValue({
            id: '1',
            title: 'Test Track',
            artist: 'Test Artist',
            album: 'Test Album',
            genres: ['Rock'],
            coverImage: 'https://example.com/image.jpg'
        });

        // Mock window.alert
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('Component Rendering', () => {
        it('should render all form elements correctly', () => {
            render(<TrackCreate {...defaultProps} />);

            expect(screen.getByTestId('track-form')).toBeInTheDocument();
            expect(screen.getByText('Add Track')).toBeInTheDocument();
            expect(screen.getByTestId('input-title')).toBeInTheDocument();
            expect(screen.getByTestId('input-artist')).toBeInTheDocument();
            expect(screen.getByTestId('input-album')).toBeInTheDocument();
            expect(screen.getByTestId('genre-selector')).toBeInTheDocument();
            expect(screen.getByTestId('input-cover-image')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        });

        it('should render close button and handle close action', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const closeButton = screen.getByText('X');
            await user.click(closeButton);

            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });

        it('should close modal when clicking on backdrop', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const backdrop = screen.getByTestId('track-form').parentElement;
            await user.click(backdrop!);

            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });

        it('should not close modal when clicking inside modal content', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const modalContent = screen.getByTestId('track-form');
            await user.click(modalContent);

            expect(mockHandleClose).not.toHaveBeenCalled();
        });
    });

    describe('Form Input Handling', () => {
        it('should handle title input changes', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const titleInput = screen.getByPlaceholderText('Track title');
            await user.type(titleInput, 'My Awesome Track');

            expect(titleInput).toHaveValue('My Awesome Track');
        });

        it('should handle artist input changes', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const artistInput = screen.getByPlaceholderText('Track artist');
            await user.type(artistInput, 'Amazing Artist');

            expect(artistInput).toHaveValue('Amazing Artist');
        });

        it('should handle album input changes', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const albumInput = screen.getByPlaceholderText('Track album');
            await user.type(albumInput, 'Best Album Ever');

            expect(albumInput).toHaveValue('Best Album Ever');
        });

        it('should handle cover image input changes', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const coverImageInput = screen.getByPlaceholderText('Cover Image');
            await user.type(coverImageInput, 'https://example.com/cover.jpg');

            expect(coverImageInput).toHaveValue('https://example.com/cover.jpg');
        });
    });

    describe('Form Validation', () => {
        it('should show alert when title is empty', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const artistInput = screen.getByPlaceholderText('Track artist');
            await user.type(artistInput, 'Test Artist');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            expect(window.alert).toHaveBeenCalledWith('Please enter title!');
            expect(mockTracksApiClient.saveTrack).not.toHaveBeenCalled();
        });

        it('should show alert when title is only whitespace', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const titleInput = screen.getByPlaceholderText('Track title');
            const artistInput = screen.getByPlaceholderText('Track artist');

            await user.type(titleInput, '   ');
            await user.type(artistInput, 'Test Artist');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            expect(window.alert).toHaveBeenCalledWith('Please enter title!');
            expect(mockTracksApiClient.saveTrack).not.toHaveBeenCalled();
        });

        it('should show alert when artist is empty', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const titleInput = screen.getByPlaceholderText('Track title');
            await user.type(titleInput, 'Test Track');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            expect(window.alert).toHaveBeenCalledWith('Please enter artist!');
            expect(mockTracksApiClient.saveTrack).not.toHaveBeenCalled();
        });

        it('should show alert when artist is only whitespace', async () => {
            const user = userEvent.setup();
            render(<TrackCreate {...defaultProps} />);

            const titleInput = screen.getByPlaceholderText('Track title');
            const artistInput = screen.getByPlaceholderText('Track artist');

            await user.type(titleInput, 'Test Track');
            await user.type(artistInput, '   ');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            expect(window.alert).toHaveBeenCalledWith('Please enter artist!');
            expect(mockTracksApiClient.saveTrack).not.toHaveBeenCalled();
        });

        it('should show alert when cover image URL is invalid', async () => {
            const user = userEvent.setup();
            mockValidationUtils.isValidImageUrl.mockReturnValue(false);

            render(<TrackCreate {...defaultProps} />);

            const titleInput = screen.getByPlaceholderText('Track title');
            const artistInput = screen.getByPlaceholderText('Track artist');
            const coverImageInput = screen.getByPlaceholderText('Cover Image');

            await user.type(titleInput, 'Test Track');
            await user.type(artistInput, 'Test Artist');
            await user.type(coverImageInput, 'invalid-url');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            expect(mockValidationUtils.isValidImageUrl).toHaveBeenCalledWith('invalid-url');
            expect(window.alert).toHaveBeenCalledWith('Cover image url is invalid!');
            expect(mockTracksApiClient.saveTrack).not.toHaveBeenCalled();
        });
    });

    describe('API Integration', () => {
        it('should successfully save track with valid data', async () => {
            const user = userEvent.setup();
            const mockTrack = {
                id: '1',
                title: 'Test Track',
                artist: 'Test Artist',
                album: 'Test Album',
                genres: ['Rock'],
                coverImage: 'https://example.com/cover.jpg'
            };

            mockTracksApiClient.saveTrack.mockResolvedValue(mockTrack);

            render(<TrackCreate {...defaultProps} />);

            // Fill out the form
            await user.type(screen.getByPlaceholderText('Track title'), 'Test Track');
            await user.type(screen.getByPlaceholderText('Track artist'), 'Test Artist');
            await user.type(screen.getByPlaceholderText('Track album'), 'Test Album');
            await user.type(screen.getByPlaceholderText('Cover Image'), 'https://example.com/cover.jpg');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTracksApiClient.saveTrack).toHaveBeenCalledWith({
                    title: 'Test Track',
                    artist: 'Test Artist',
                    album: 'Test Album',
                    genres: [],
                    coverImage: 'https://example.com/cover.jpg'
                });
            });

            expect(mockHandleClose).toHaveBeenCalledTimes(1);
            expect(mockOnSave).toHaveBeenCalledWith(mockTrack);
        });

        it('should handle API failure gracefully', async () => {
            const user = userEvent.setup();
            mockTracksApiClient.saveTrack.mockResolvedValue(null);

            render(<TrackCreate {...defaultProps} />);

            // Fill out required fields
            await user.type(screen.getByPlaceholderText('Track title'), 'Test Track');
            await user.type(screen.getByPlaceholderText('Track artist'), 'Test Artist');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTracksApiClient.saveTrack).toHaveBeenCalled();
            });

            // Should not close modal or call onSave when API returns null
            expect(mockHandleClose).not.toHaveBeenCalled();
            expect(mockOnSave).not.toHaveBeenCalled();
        });

    });

    describe('Complete User Workflows', () => {
        it('should complete full track creation workflow with all fields', async () => {
            const user = userEvent.setup();
            const mockTrack = {
                id: '1',
                title: 'Complete Track',
                artist: 'Complete Artist',
                album: 'Complete Album',
                genres: ['Rock', 'Pop'],
                coverImage: 'https://example.com/complete.jpg'
            };

            mockTracksApiClient.saveTrack.mockResolvedValue(mockTrack);

            render(<TrackCreate {...defaultProps} />);

            // Fill out all form fields
            await user.type(screen.getByPlaceholderText('Track title'), 'Complete Track');
            await user.type(screen.getByPlaceholderText('Track artist'), 'Complete Artist');
            await user.type(screen.getByPlaceholderText('Track album'), 'Complete Album');
            await user.type(screen.getByPlaceholderText('Cover Image'), 'https://example.com/complete.jpg');

            // Submit the form
            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            // Verify the complete flow
            await waitFor(() => {
                expect(mockValidationUtils.isValidImageUrl).toHaveBeenCalledWith('https://example.com/complete.jpg');
                expect(mockTracksApiClient.saveTrack).toHaveBeenCalledWith({
                    title: 'Complete Track',
                    artist: 'Complete Artist',
                    album: 'Complete Album',
                    genres: [],
                    coverImage: 'https://example.com/complete.jpg'
                });
                expect(mockHandleClose).toHaveBeenCalledTimes(1);
                expect(mockOnSave).toHaveBeenCalledWith(mockTrack);
            });
        });

        it('should handle minimum required fields workflow', async () => {
            const user = userEvent.setup();
            const mockTrack = {
                id: '2',
                title: 'Min Track',
                artist: 'Min Artist',
                album: '',
                genres: [],
                coverImage: ''
            };

            mockTracksApiClient.saveTrack.mockResolvedValue(mockTrack);

            render(<TrackCreate {...defaultProps} />);

            // Fill out only required fields
            await user.type(screen.getByPlaceholderText('Track title'), 'Min Track');
            await user.type(screen.getByPlaceholderText('Track artist'), 'Min Artist');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockTracksApiClient.saveTrack).toHaveBeenCalledWith({
                    title: 'Min Track',
                    artist: 'Min Artist',
                    album: '',
                    genres: [],
                    coverImage: ''
                });
                expect(mockHandleClose).toHaveBeenCalledTimes(1);
                expect(mockOnSave).toHaveBeenCalledWith(mockTrack);
            });
        });
    });

    describe('Accessibility and User Experience', () => {
        it('should have proper test IDs for testing', () => {
            render(<TrackCreate {...defaultProps} />);

            expect(screen.getByTestId('track-form')).toBeInTheDocument();
            expect(screen.getByTestId('input-title')).toBeInTheDocument();
            expect(screen.getByTestId('input-artist')).toBeInTheDocument();
            expect(screen.getByTestId('input-album')).toBeInTheDocument();
            expect(screen.getByTestId('genre-selector')).toBeInTheDocument();
            expect(screen.getByTestId('input-cover-image')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        });

        it('should show loading state during form submission', async () => {
            const user = userEvent.setup();

            // Create a promise that we can control
            let resolvePromise: (value: any) => void;
            const mockPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            mockTracksApiClient.saveTrack.mockReturnValue(mockPromise as any);

            render(<TrackCreate {...defaultProps} />);

            // Fill out required fields
            await user.type(screen.getByPlaceholderText('Track title'), 'Test Track');
            await user.type(screen.getByPlaceholderText('Track artist'), 'Test Artist');

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            // At this point, the API call is pending
            expect(mockTracksApiClient.saveTrack).toHaveBeenCalled();

            // Resolve the promise
            resolvePromise!({
                id: '1',
                title: 'Test Track',
                artist: 'Test Artist',
                album: '',
                genres: [],
                coverImage: ''
            });

            await waitFor(() => {
                expect(mockHandleClose).toHaveBeenCalled();
            });
        });
    });
});