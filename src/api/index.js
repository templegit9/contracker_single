/**
 * API module index
 * 
 * This file exports all API functions from the platform-specific modules.
 * It serves as a central point for importing API functionality throughout the application.
 */

export {
  fetchYouTubeInfo,
  fetchServiceNowInfo,
  fetchLinkedInInfo,
  extractContentId
} from './platformApis'; 