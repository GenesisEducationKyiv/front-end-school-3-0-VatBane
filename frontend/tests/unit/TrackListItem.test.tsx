import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackListItem from "../../src/components/TrackListItem/TrackListItem";
import { FilesApiClient } from "../../src/api/apiFiles";
import { TracksApiClient } from "../../src/api/apiTracks";

// Mock the ApiClient
vi.mock('../../src/api/apiFiles', () => ({
    FilesApiClient: {
        uploadFile: vi.fn()
    }
}));

vi.mock('../../src/api/apiTracks', () => ({
    TracksApiClient: {
        deleteTrack: vi.fn()
    }
}));


// Mock images
vi.mock('/src/assets/emptyCover.png', () => ({ default: 'empty-cover.png' }));
vi.mock('/src/assets/uploadIcon.png', () => ({ default: 'upload-icon.png' }));
vi.mock('/src/assets/editIcon.png', () => ({ default: 'edit-icon.png' }));
vi.mock('/src/assets/deleteIcon.png', () => ({ default: 'delete-icon.png' }));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
    writable: true,
    value: vi.fn()
});

// Mock window.alert
Object.defineProperty(window, 'alert', {
    writable: true,
    value: vi.fn()
});

describe('TrackListItem', () => {
    const mockTrack = {
        id: '1',
        title: 'Test Song',
        artist: 'Test Artist',
        coverImage: 'test-cover.jpg'
    };

    const defaultProps = {
        track: mockTrack,
        onDelete: vi.fn(),
        handleEditClick: vi.fn(),
        setCurrentTrack: vi.fn(),
        onContextMenu: vi.fn(),
        onClick: vi.fn(),
        isSelected: false,
        onUpload: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders track information correctly', () => {
        render(<TrackListItem {...defaultProps} />);

        expect(screen.getByTestId('track-item-1-title')).toHaveTextContent('Test Song');
        expect(screen.getByTestId('track-item-1-artist')).toHaveTextContent('Test Artist');
        expect(screen.getByAltText('coverImage')).toHaveAttribute('src', 'test-cover.jpg');
    });

    it('applies selected class when isSelected is true', () => {
        render(<TrackListItem {...defaultProps} isSelected={true} />);

        expect(screen.getByTestId('track-item-1')).toHaveClass('selected');
    });

    it('does not apply selected class when isSelected is false', () => {
        render(<TrackListItem {...defaultProps} isSelected={false} />);

        expect(screen.getByTestId('track-item-1')).not.toHaveClass('selected');
    });

    it('calls setCurrentTrack when track container is clicked', async () => {
        const user = userEvent.setup();
        render(<TrackListItem {...defaultProps} />);

        await user.click(screen.getByText('Test Song'));

        expect(defaultProps.setCurrentTrack).toHaveBeenCalledWith(mockTrack);
    });

    it('calls onContextMenu when right-clicked', async () => {
        const user = userEvent.setup();
        render(<TrackListItem {...defaultProps} />);

        const trackItem = screen.getByTestId('track-item-1');
        await user.pointer({ keys: '[MouseRight]', target: trackItem });

        expect(defaultProps.onContextMenu).toHaveBeenCalledWith(
            expect.any(Object),
            mockTrack
        );
    });

    it('shows confirmation dialog and calls onDelete when delete is confirmed', async () => {
        const user = userEvent.setup();
        (window.confirm as Mock).mockReturnValue(true);
        TracksApiClient.deleteTrack.mockResolvedValue(false);

        render(<TrackListItem {...defaultProps} />);

        await user.click(screen.getByTestId('delete-track-1'));

        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete Test Song?');
        await waitFor(() => {
            expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTrack);
        });
    });

    it('does not delete when confirmation is cancelled', async () => {
        const user = userEvent.setup();
        (window.confirm as Mock).mockReturnValue(false);

        render(<TrackListItem {...defaultProps} />);

        await user.click(screen.getByTestId('delete-track-1'));

        expect(window.confirm).toHaveBeenCalled();
        expect(TracksApiClient.deleteTrack).not.toHaveBeenCalled();
        expect(defaultProps.onDelete).not.toHaveBeenCalled();
    });

    it('does not call onDelete when deleteTrack returns true', async () => {
        const user = userEvent.setup();
        (window.confirm as Mock).mockReturnValue(true);
        TracksApiClient.deleteTrack.mockResolvedValue(true);

        render(<TrackListItem {...defaultProps} />);

        await user.click(screen.getByTestId('delete-track-1'));

        await waitFor(() => {
            expect(TracksApiClient.deleteTrack).toHaveBeenCalledWith('1');
        });
        expect(defaultProps.onDelete).not.toHaveBeenCalled();
    });

    it('uploads valid mp3 file successfully', async () => {
        const user = userEvent.setup();
        FilesApiClient.uploadFile.mockResolvedValue(true);

        render(<TrackListItem {...defaultProps} />);

        const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
        const input = screen.getByTestId('upload-track-1');

        await user.upload(input, file);

        expect(FilesApiClient.uploadFile).toHaveBeenCalledWith('1', file);
        expect(defaultProps.onUpload).toHaveBeenCalled();
    });

    it('uploads valid wav file successfully', async () => {
        const user = userEvent.setup();
        (FilesApiClient.uploadFile as Mock).mockResolvedValue(true);

        render(<TrackListItem {...defaultProps} />);

        const file = new File(['audio content'], 'test.wav', { type: 'audio/wav' });
        const input = screen.getByTestId('upload-track-1');

        await user.upload(input, file);

        expect(FilesApiClient.uploadFile).toHaveBeenCalledWith('1', file);
        expect(defaultProps.onUpload).toHaveBeenCalled();
    });

    it('rejects invalid file types and shows alert', async () => {

        render(<TrackListItem {...defaultProps} />);

        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByTestId('upload-track-1');
        fireEvent.change(input, { target: { files: [file] } });

        expect(window.alert).toHaveBeenCalledWith('Allowed only .mp3 and .wav files!');
        expect(FilesApiClient.uploadFile).not.toHaveBeenCalled();
        expect(defaultProps.onUpload).not.toHaveBeenCalled();
    });

    it('does not call onUpload when upload fails', async () => {
        const user = userEvent.setup();
        (FilesApiClient.uploadFile as Mock).mockResolvedValue(false);

        render(<TrackListItem {...defaultProps} />);

        const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
        const input = screen.getByTestId('upload-track-1');

        await user.upload(input, file);

        expect(FilesApiClient.uploadFile).toHaveBeenCalledWith('1', file);
        expect(defaultProps.onUpload).not.toHaveBeenCalled();
    });

    it('handles empty file selection', async () => {
        const user = userEvent.setup();

        render(<TrackListItem {...defaultProps} />);

        const input = screen.getByTestId('upload-track-1');

        // Simulate selecting no file
        fireEvent.change(input, { target: { files: [] } });

        expect(FilesApiClient.uploadFile).not.toHaveBeenCalled();
        expect(defaultProps.onUpload).not.toHaveBeenCalled();
    });

    it('falls back to empty cover when image fails to load', () => {
        render(<TrackListItem {...defaultProps} />);

        const img = screen.getByAltText('coverImage');

        // Simulate image load error
        fireEvent.error(img);

        expect(img).toHaveAttribute('src', 'empty-cover.png');
    });

    it('handles track without cover image', () => {
        const trackWithoutCover = { ...mockTrack, coverImage: undefined };
        render(<TrackListItem {...defaultProps} track={trackWithoutCover} />);

        const img = screen.getByAltText('coverImage');
        expect(img).toHaveAttribute('src', 'empty-cover.png');
    });
});