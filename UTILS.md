# Utils Test Suite

This document explains the helper functions in `helpers.js` and how their corresponding tests work in `helpers.test.js`. It is meant to serve as a simple reference.

## Helpers Overview

### displayName()

Returns `"fname lname"` if both exist, otherwise just first name.

### toProperCase()

Converts any string to proper case.

### convertToCurrency()

Formats numbers into USD currency with no cents.

### formatGenres()

Converts comma-separated genres into capitalized, readable text.

### formatDate()

Converts dates into `"Jan 1, 2000"` format.

### formatTime()

Converts `"HH:MM:SS"` into `"1h 41m"` style.

## Tests

`helpers.test.js` verifies:

- Name formatting
- Proper casing
- Currency formatting
- Genre formatting
- Date formatting
- Time formatting

Run with:

```
npm test
```
