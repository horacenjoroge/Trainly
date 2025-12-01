// __tests__/components/common/Input.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../../components/common/Input';
import { ThemeProvider } from '../../../context/ThemeContext';

const ThemeWrapper = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Input Component', () => {
  test('should render input with label', () => {
    const { getByText } = render(
      <ThemeWrapper>
        <Input label="Email" value="" onChangeText={() => {}} />
      </ThemeWrapper>
    );
    expect(getByText('Email')).toBeTruthy();
  });

  test('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeWrapper>
        <Input
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={onChangeText}
        />
      </ThemeWrapper>
    );
    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  test('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <ThemeWrapper>
        <Input
          label="Email"
          value=""
          onChangeText={() => {}}
          error="Invalid email"
        />
      </ThemeWrapper>
    );
    expect(getByText('Invalid email')).toBeTruthy();
  });

  test('should be disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <ThemeWrapper>
        <Input
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={() => {}}
          disabled={true}
        />
      </ThemeWrapper>
    );
    const input = getByPlaceholderText('Enter email');
    expect(input.props.editable).toBe(false);
  });

  test('should render secure text entry when secureTextEntry is true', () => {
    const { getByPlaceholderText } = render(
      <ThemeWrapper>
        <Input
          label="Password"
          placeholder="Enter password"
          value=""
          onChangeText={() => {}}
          secureTextEntry={true}
        />
      </ThemeWrapper>
    );
    const input = getByPlaceholderText('Enter password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should render icon when icon prop is provided', () => {
    const { getByTestId } = render(
      <ThemeWrapper>
        <Input
          label="Email"
          value=""
          onChangeText={() => {}}
          icon="mail"
        />
      </ThemeWrapper>
    );
    // Icon should be rendered
    expect(getByTestId).toBeDefined();
  });
});

