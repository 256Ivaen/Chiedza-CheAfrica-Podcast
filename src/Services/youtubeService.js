import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

// Validate configuration
if (!API_KEY) {
  console.error('YouTube API Key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file');
}

if (!CHANNEL_ID) {
  console.error('YouTube Channel ID is not configured. Please set VITE_YOUTUBE_CHANNEL_ID in your .env file');
}

export const youtubeService = {
  async getChannelVideos(maxResults = 50, pageToken = '') {
    try {
      if (!CHANNEL_ID || !API_KEY) {
        throw new Error('YouTube API not configured. Please check your API key and channel ID in environment variables.');
      }

      console.log('Fetching YouTube channel data...');

      // First, get the uploads playlist ID
      const channelResponse = await axios.get(`${BASE_URL}/channels`, {
        params: {
          part: 'contentDetails',
          id: CHANNEL_ID,
          key: API_KEY
        }
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found. Please check your Channel ID.');
      }

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      console.log('Found uploads playlist:', uploadsPlaylistId);

      // Then get all videos from the uploads playlist
      const videosResponse = await axios.get(`${BASE_URL}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: maxResults,
          pageToken: pageToken,
          key: API_KEY
        }
      });

      console.log(`Found ${videosResponse.data.items?.length || 0} videos`);

      // Get video details to detect Shorts
      const videoIds = videosResponse.data.items.map(item => item.contentDetails.videoId).join(',');
      
      const videoDetailsResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: 'contentDetails,snippet',
          id: videoIds,
          key: API_KEY
        }
      });

      const videoDetailsMap = {};
      videoDetailsResponse.data.items.forEach(video => {
        videoDetailsMap[video.id] = video;
      });

      return {
        videos: this.transformYouTubeData(videosResponse.data.items, videoDetailsMap),
        nextPageToken: videosResponse.data.nextPageToken,
        totalResults: videosResponse.data.pageInfo?.totalResults || 0
      };
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      if (error.response) {
        console.error('YouTube API response error:', error.response.data);
      }
      return { videos: [], nextPageToken: '', totalResults: 0 };
    }
  },

  transformYouTubeData(youtubeItems, videoDetailsMap = {}) {
    if (!youtubeItems) return [];
    
    return youtubeItems.map((item, index) => {
      const snippet = item.snippet;
      const videoId = item.contentDetails?.videoId;
      const videoDetails = videoDetailsMap[videoId];
      
      // Detect if it's a Short (vertical video, typically under 60 seconds)
      const isShort = this.isYouTubeShort(videoDetails, snippet);
      
      return {
        id: videoId || `episode-${index}-${Date.now()}`,
        title: snippet.title || 'Untitled Episode',
        excerpt: snippet.description ? (snippet.description.substring(0, 150) + (snippet.description.length > 150 ? '...' : '')) : 'No description available',
        content: snippet.description || '',
        date: snippet.publishedAt || new Date().toISOString(),
        readTime: this.estimateReadTime(snippet.description),
        author: snippet.channelTitle || 'Chiedza CheAfrica Podcast',
        category: isShort ? 'YouTube Short' : 'Podcast Episode',
        image: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
        videoId: videoId,
        type: isShort ? 'short' : 'video',
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        shortUrl: isShort ? `https://www.youtube.com/shorts/${videoId}` : null,
        tags: isShort ? ['short', 'youtube-short'] : ['podcast', 'episode', 'youtube'],
        featured: index < 3 && !isShort, // First 3 non-short episodes are featured
        heroData: index === 0 && !isShort, // First non-short episode is hero
        isShort: isShort,
        duration: videoDetails?.contentDetails?.duration || null
      };
    });
  },

  isYouTubeShort(videoDetails, snippet) {
    // Method 1: Check title for #Shorts or #Short
    const title = snippet?.title || '';
    if (title.includes('#Shorts') || title.includes('#Short') || title.toLowerCase().includes('short')) {
      return true;
    }

    // Method 2: Check description for Shorts mention
    const description = snippet?.description || '';
    if (description.includes('#Shorts') || description.includes('#Short')) {
      return true;
    }

    // Method 3: Check video duration (Shorts are typically under 60 seconds)
    if (videoDetails?.contentDetails?.duration) {
      const duration = videoDetails.contentDetails.duration;
      const durationInSeconds = this.parseYouTubeDuration(duration);
      if (durationInSeconds <= 60) {
        return true;
      }
    }

    return false;
  },

  parseYouTubeDuration(duration) {
    // Parse YouTube duration format (PT1M30S -> 90 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    return hours * 3600 + minutes * 60 + seconds;
  },

  estimateReadTime(description) {
    if (!description) return '1 min watch';
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min watch`;
  },

  // Separate methods to get only specific types
  async getRegularVideos(maxResults = 50) {
    const response = await this.getChannelVideos(maxResults);
    const regularVideos = response.videos.filter(video => !video.isShort);
    return {
      ...response,
      videos: regularVideos
    };
  },

  async getShorts(maxResults = 50) {
    const response = await this.getChannelVideos(maxResults);
    const shorts = response.videos.filter(video => video.isShort);
    return {
      ...response,
      videos: shorts
    };
  }

};

export default youtubeService;