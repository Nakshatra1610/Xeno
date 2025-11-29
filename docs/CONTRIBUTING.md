# Contributing to Xeno Shopify Insights

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure
5. Set up database: `npx prisma db push`
6. Run dev server: `npm run dev`

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use Prettier for formatting
- Write meaningful commit messages

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your fork
6. Create a Pull Request

## Testing

Before submitting:
- Test all affected features
- Ensure no TypeScript errors
- Check database migrations work
- Test on different screen sizes

## Reporting Issues

Use GitHub Issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Questions?

Feel free to open a discussion or issue!
