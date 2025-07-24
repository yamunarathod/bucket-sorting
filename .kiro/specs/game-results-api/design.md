# Design Document

## Overview

This design implements an API integration system that automatically sends game results to a webhook endpoint when players complete the bucket sorting game. The solution will be integrated into the existing UnifiedGameScreen component and will trigger API calls when the game transitions to the 'results' phase.

The system will send a structured JSON payload containing player email, score, and fixed metadata to the specified webhook URL using a non-blocking approach to ensure the user experience remains smooth.

## Architecture

### High-Level Flow
1. Game completion triggers result submission
2. API service formats and sends data to webhook
3. Error handling ensures graceful degradation
4. User sees results regardless of API status

### Integration Points
- **Trigger Points**: Game completion (time up or all skills placed)
- **Data Sources**: Player email (state), final score (state), fixed metadata (constants)
- **External Dependency**: Webhook endpoint at https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98

## Components and Interfaces

### API Service Module (`src/services/gameResultsApi.js`)
```javascript
// Main API service interface
export const submitGameResults = async (gameData) => Promise<void>

// Data transformation utilities
const formatGameResultsPayload = (email, score) => Object

// HTTP client with error handling
const sendToWebhook = async (payload) => Promise<Response>
```

### Game Results Hook (`src/hooks/useGameResults.js`)
```javascript
// Custom hook for managing API submission
export const useGameResults = () => {
  submitResults: (email, score) => Promise<void>,
  isSubmitting: boolean,
  error: string | null
}
```

### Enhanced UnifiedGameScreen Component
- Integration of useGameResults hook
- Trigger API calls on game completion
- Error state management (optional, non-blocking)

## Data Models

### Game Results Payload
```javascript
{
  "email": string,        // Player's email address
  "element_id": "05",     // Fixed identifier
  "game_name": "Bucket Sorting", // Fixed game name
  "location": "surat",    // Fixed location
  "score": number         // Player's final score (0-6)
}
```

### API Response Handling
- Success: No specific handling required
- Error: Log error, continue normal flow
- Timeout: 10 second timeout, then continue

## Error Handling

### Network Errors
- Connection failures: Log error, continue game flow
- Timeout errors: Log error, continue game flow
- Invalid responses: Log error, continue game flow

### Data Validation
- Email validation: Ensure email exists before sending
- Score validation: Ensure score is a valid number (0-6)
- Payload validation: Verify required fields are present

### Graceful Degradation
- API failures do not block user interface
- Results screen shows immediately regardless of API status
- Error logging for debugging purposes
- No user-facing error messages for API failures

## Testing Strategy

### Unit Tests
- API service functions (payload formatting, HTTP requests)
- Custom hook behavior (loading states, error handling)
- Data validation functions

### Integration Tests
- End-to-end game completion flow
- API integration with mock webhook
- Error scenarios and graceful degradation

### Manual Testing
- Complete game and verify API call
- Test with network disconnected
- Test with invalid webhook URL
- Verify user experience remains smooth during API failures

## Implementation Considerations

### Performance
- Non-blocking API calls using async/await
- No UI delays during API submission
- Minimal impact on existing game performance

### Security
- No sensitive data exposure in API calls
- HTTPS endpoint for secure transmission
- No authentication tokens stored in client

### Maintainability
- Configurable webhook URL for easy updates
- Modular API service for easy testing
- Clear separation of concerns between game logic and API integration

### Browser Compatibility
- Uses modern fetch API (supported in all target browsers)
- Graceful handling of network API availability
- No external dependencies required