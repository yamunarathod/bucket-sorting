# Implementation Plan

- [ ] 1. Create API service module for webhook integration
  - Create `src/services/gameResultsApi.js` with functions to format payload and send HTTP requests
  - Implement payload formatting function that creates the exact JSON structure required
  - Implement HTTP client function with proper error handling and timeout configuration
  - Add input validation for email and score parameters
  - _Requirements: 2.1, 2.2, 2.6, 3.2, 4.3_

- [ ] 2. Create custom hook for game results submission
  - Create `src/hooks/useGameResults.js` that manages API submission state
  - Implement hook that provides submitResults function and loading/error states
  - Add proper error handling that doesn't throw exceptions to calling components
  - Include optional state tracking for submission status (for debugging)
  - _Requirements: 3.1, 3.3, 4.1_

- [ ] 3. Integrate API submission into game completion flow
  - Modify the `handleTimeUp` function in UnifiedGameScreen to trigger API submission
  - Modify the skill placement completion logic to trigger API submission when all skills are placed
  - Ensure API calls are made with current playerEmail and score state values
  - Implement non-blocking submission that doesn't delay results screen display
  - _Requirements: 1.1, 1.2, 1.3, 3.1_

- [ ] 4. Add error handling and logging
  - Implement console logging for API errors without exposing them to users
  - Add try-catch blocks around API calls to prevent crashes
  - Ensure game continues normal operation even if API fails
  - Add validation to ensure required data (email, score) exists before API calls
  - _Requirements: 1.4, 3.2, 3.4, 4.4_

- [ ] 5. Write unit tests for API service
  - Create test file `src/services/__tests__/gameResultsApi.test.js`
  - Test payload formatting with various email and score combinations
  - Test HTTP client error handling scenarios (network errors, timeouts)
  - Test input validation for edge cases (empty email, invalid scores)
  - _Requirements: 2.6, 3.2, 4.4_

- [ ] 6. Write tests for custom hook
  - Create test file `src/hooks/__tests__/useGameResults.test.js`
  - Test hook state management during submission process
  - Test error handling behavior in hook
  - Test that hook doesn't throw unhandled exceptions
  - _Requirements: 3.3, 4.1_

- [ ] 7. Integration testing and final verification
  - Test complete game flow with API integration enabled
  - Verify API is called with correct data format when game completes via timeout
  - Verify API is called with correct data format when all skills are placed
  - Test that game continues normally when API fails or is unreachable
  - Verify no user-facing errors appear during API failures
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.3_