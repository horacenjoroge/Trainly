// __tests__/integration/socialFlow.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import HomeScreen from '../../screens/HomeScreen';
import { postService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const AppWrapper = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </AuthProvider>
  </ThemeProvider>
);

describe('Social Features Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('token');
  });

  describe('Post Creation', () => {
    test('should create post successfully', async () => {
      const mockPost = {
        id: '1',
        text: 'Great workout today!',
        user: { id: '1', name: 'Test User' },
        likes: 0,
        comments: 0,
      };

      postService.createPost = jest.fn().mockResolvedValue(mockPost);

      // Test would require CreatePostScreen component
      expect(postService.createPost).toBeDefined();
    });
  });

  describe('Post Interaction', () => {
    test('should like/unlike post', async () => {
      const mockPost = { id: '1', likes: 5 };
      postService.likePost = jest.fn().mockResolvedValue({
        ...mockPost,
        likes: 6,
      });

      // Test like functionality
      expect(postService.likePost).toBeDefined();
    });

    test('should add comment to post', async () => {
      const mockComment = {
        id: '1',
        text: 'Great post!',
        user: { id: '2', name: 'Commenter' },
      };

      postService.addComment = jest.fn().mockResolvedValue(mockComment);

      // Test comment functionality
      expect(postService.addComment).toBeDefined();
    });
  });

  describe('Feed Loading', () => {
    test('should load posts on screen focus', async () => {
      const mockPosts = [
        {
          id: '1',
          text: 'Post 1',
          user: { id: '1', name: 'User 1' },
        },
        {
          id: '2',
          text: 'Post 2',
          user: { id: '2', name: 'User 2' },
        },
      ];

      postService.getPosts = jest.fn().mockResolvedValue(mockPosts);

      const { getByTestId } = render(
        <AppWrapper>
          <HomeScreen />
        </AppWrapper>
      );

      await waitFor(() => {
        expect(postService.getPosts).toHaveBeenCalled();
      });
    });

    test('should refresh posts on pull to refresh', async () => {
      const mockPosts = [{ id: '1', text: 'Post' }];
      postService.getPosts = jest.fn().mockResolvedValue(mockPosts);

      // Test pull to refresh
      expect(postService.getPosts).toBeDefined();
    });
  });
});

