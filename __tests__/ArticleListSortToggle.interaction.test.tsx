import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArticleListSortToggle } from '@/features/articles/components/ArticleListSortToggle';
import { ThemeProvider } from '@/shared/theme/ThemeContext';

test('ArticleListSortToggle calls onChange when user selects another sort mode', () => {
  const onChange = jest.fn();

  render(
    <ThemeProvider>
      <ArticleListSortToggle value="score" onChange={onChange} />
    </ThemeProvider>,
  );

  fireEvent.press(screen.getByRole('button', { name: 'Time' }));

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('time');
});
