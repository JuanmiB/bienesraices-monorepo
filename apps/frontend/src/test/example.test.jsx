import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component for testing
const HelloWorld = () => <h1>Hello World</h1>;

describe('Example Test', () => {
  it('should render hello world', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should perform basic math', () => {
    expect(2 + 2).toBe(4);
  });
});
