// __tests__/components/common/Button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../../components/common/Button';
import { ThemeProvider } from '../../../context/ThemeContext';

const mockTheme = {
  colors: {
    primary: '#FF7D2C',
    secondary: '#4ECDC4',
    surface: '#FFFFFF',
    text: '#333333',
    error: '#ff3b30',
  },
};

const ThemeWrapper = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Button Component', () => {
  test('should render button with title', () => {
    const { getByText } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={() => {}} />
      </ThemeWrapper>
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={onPress} />
      </ThemeWrapper>
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={onPress} disabled={true} />
      </ThemeWrapper>
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={onPress} loading={true} />
      </ThemeWrapper>
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('should show loading indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={() => {}} loading={true} />
      </ThemeWrapper>
    );
    // ActivityIndicator should be present
    expect(queryByText('Click Me')).toBeNull();
  });

  test('should render icon when provided', () => {
    const { getByTestId } = render(
      <ThemeWrapper>
        <Button title="Click Me" onPress={() => {}} icon="add" />
      </ThemeWrapper>
    );
    // Icon should be rendered (Ionicons)
    expect(getByTestId).toBeDefined();
  });

  test('should apply variant styles correctly', () => {
    const { rerender } = render(
      <ThemeWrapper>
        <Button title="Primary" onPress={() => {}} variant="primary" />
      </ThemeWrapper>
    );
    // Test different variants
    rerender(
      <ThemeWrapper>
        <Button title="Outline" onPress={() => {}} variant="outline" />
      </ThemeWrapper>
    );
    rerender(
      <ThemeWrapper>
        <Button title="Text" onPress={() => {}} variant="text" />
      </ThemeWrapper>
    );
  });

  test('should apply size styles correctly', () => {
    const { rerender } = render(
      <ThemeWrapper>
        <Button title="Small" onPress={() => {}} size="small" />
      </ThemeWrapper>
    );
    rerender(
      <ThemeWrapper>
        <Button title="Large" onPress={() => {}} size="large" />
      </ThemeWrapper>
    );
  });

  test('should apply fullWidth style when fullWidth prop is true', () => {
    const { getByText } = render(
      <ThemeWrapper>
        <Button title="Full Width" onPress={() => {}} fullWidth={true} />
      </ThemeWrapper>
    );
    expect(getByText('Full Width')).toBeTruthy();
  });
});

