import { fetchYouTubeInfo, fetchServiceNowInfo, fetchLinkedInInfo } from '../api/platformApis';

// Mock fetch
global.fetch = jest.fn();

describe('Platform APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchYouTubeInfo', () => {
    test('throws error when API key is not provided', async () => {
      await expect(fetchYouTubeInfo('videoId', '')).rejects.toThrow(
        'YouTube API key is not configured'
      );
    });

    test('returns video information when API call is successful', async () => {
      // Mock successful API response
      const mockResponse = {
        items: [
          {
            snippet: {
              title: 'Test Video',
              publishedAt: '2023-01-01T00:00:00Z'
            },
            contentDetails: {
              duration: 'PT2M30S' // 2 minutes 30 seconds
            }
          }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await fetchYouTubeInfo('videoId', 'apiKey');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=videoId&key=apiKey'
      );
      expect(result).toEqual({
        title: 'Test Video',
        publishedDate: new Date('2023-01-01T00:00:00Z'),
        duration: '2:30'
      });
    });

    test('returns fallback data when API call fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API error'));

      const result = await fetchYouTubeInfo('videoId', 'apiKey');

      expect(result).toEqual({
        title: 'YouTube Video: videoId',
        publishedDate: expect.any(Date),
        duration: '0:00'
      });
    });
  });

  describe('fetchServiceNowInfo', () => {
    test('throws error when config is incomplete', async () => {
      await expect(
        fetchServiceNowInfo('blogId', { instance: '', username: '', password: '' })
      ).rejects.toThrow('ServiceNow API configuration is incomplete');
    });

    test('returns blog information', async () => {
      const config = {
        instance: 'test.service-now.com',
        username: 'testuser',
        password: 'testpass'
      };

      const result = await fetchServiceNowInfo('blogId', config);

      expect(result).toEqual({
        title: 'ServiceNow Blog: blogId',
        publishedDate: expect.any(Date)
      });
    });
  });

  describe('fetchLinkedInInfo', () => {
    test('throws error when config is incomplete', async () => {
      await expect(
        fetchLinkedInInfo('postId', { clientId: '', clientSecret: '' })
      ).rejects.toThrow('LinkedIn API configuration is incomplete');
    });

    test('returns post information', async () => {
      const config = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
      };

      const result = await fetchLinkedInInfo('postId', config);

      expect(result).toEqual({
        title: 'LinkedIn Post: postId',
        publishedDate: expect.any(Date)
      });
    });
  });
}); 