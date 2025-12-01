# Test Suite Documentation

## Overview

This directory contains comprehensive unit and integration tests for the Trainly mobile application. The test suite uses Jest and React Native Testing Library to ensure code quality and reliability.

## Test Structure

```
__tests__/
├── components/          # Component unit tests
│   └── common/         # Common component tests
├── hooks/              # Custom hook tests
├── integration/        # Integration tests for user flows
├── services/           # Service/API tests
├── utils/              # Utility function tests
├── setup.js            # Test configuration and mocks
└── README.md           # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in CI mode
```bash
npm run test:ci
```

## Test Coverage

The test suite aims for:
- **60% minimum coverage** across all metrics (branches, functions, lines, statements)
- **Unit tests** for all utilities, hooks, and components
- **Integration tests** for critical user flows

## Test Categories

### Unit Tests

#### Utilities (`utils/`)
- **validation.test.js**: Form validation rules and functions
- **dateUtils.test.js**: Date formatting and manipulation
- **imageUtils.test.js**: Image URI handling
- **errorHandler.test.js**: API error handling

#### Components (`components/`)
- **Button.test.js**: Reusable button component
- **Input.test.js**: Form input component
- More component tests can be added as needed

#### Hooks (`hooks/`)
- **useImageUpload.test.js**: Image upload functionality
- **useNetworkStatus.test.js**: Network connectivity monitoring

#### Services (`services/`)
- **authService.test.js**: Authentication API calls

### Integration Tests

#### Authentication Flow (`integration/authFlow.test.js`)
- User registration
- User login
- Form validation
- Error handling

#### Workout Flow (`integration/workoutFlow.test.js`)
- Workout selection
- Workout creation
- Workout tracking
- Workout saving

#### Social Flow (`integration/socialFlow.test.js`)
- Post creation
- Post interactions (like, comment)
- Feed loading
- Pull to refresh

## Mocking

The test suite uses comprehensive mocks for:
- **AsyncStorage**: Local storage operations
- **Expo modules**: Location, Image Picker, Secure Store, etc.
- **React Navigation**: Navigation functions
- **NetInfo**: Network status
- **API clients**: HTTP requests

Mocks are configured in `setup.js`.

## Writing New Tests

### Component Test Example
```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  test('should render correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### Hook Test Example
```javascript
import { renderHook, act } from '@testing-library/react-native';
import useMyHook from '../../hooks/useMyHook';

describe('useMyHook', () => {
  test('should return initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

### Service Test Example
```javascript
import { myService } from '../../services/myService';
import apiClient from '../../services/api';

jest.mock('../../services/api');

describe('myService', () => {
  test('should call API correctly', async () => {
    apiClient.get.mockResolvedValue({ data: { result: 'success' } });
    const result = await myService.getData();
    expect(result).toEqual({ result: 'success' });
  });
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component/hook does, not how it does it
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Keep tests isolated**: Each test should be independent and not rely on other tests
4. **Mock external dependencies**: Always mock API calls, storage, and native modules
5. **Test edge cases**: Include tests for error states, empty states, and boundary conditions
6. **Maintain test coverage**: Aim for high coverage but prioritize critical paths

## Continuous Integration

Tests are configured to run in CI environments with:
- Maximum 2 workers for parallel execution
- Coverage reports generated
- Failures reported clearly

## Troubleshooting

### Tests failing with "Cannot find module"
- Ensure all dependencies are installed: `npm install`
- Check that mocks are properly configured in `setup.js`

### Async tests timing out
- Use `waitFor` for async operations
- Increase timeout if needed: `jest.setTimeout(10000)`

### Navigation tests failing
- Ensure NavigationContainer is wrapped in test
- Mock navigation functions properly

## Future Improvements

- [ ] Add E2E tests with Detox
- [ ] Increase test coverage to 80%+
- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Add accessibility tests

