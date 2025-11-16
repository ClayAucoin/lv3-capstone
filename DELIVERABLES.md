# Deliverables

## Submit the following through Moodle:

### GitHub Repository Link

- [x] Your capstone project repository
      https://github.com/ClayAucoin/lv3-capstone

- [x] Include all refactored code and test files
      Files are in repo
- [x] Make sure the repository is public or shared with your instructor

### Test Files

- [x] Show your test files with comprehensive test coverage
- [x] Include screenshots of all tests passing (green)

### Function Documentation

- [x] Document each function's inputs and outputs
- [x] Can be in code comments, README, or separate documentation file

### Before/After Comparison

- [x] Show the old code (before refactoring)
- [x] Show the new code (using pure functions)
- [x] Explain what was improved
      I was shocked. When converting formatGenres function, since my values are all formatted to lowercase with no spaces before or after the comma in the database, I it didn't actually work on the edge cases I tested with.

### Reflection (3-4 paragraphs)

- [x] What functions did you extract and why?
- [x] How did writing tests first help you design better functions?
- [x] What challenges did you face during refactoring?
- [x] How did this improve your code quality?

## Reflection

When I broke the code apart, I mainly pulled out the functions that were doing small, repetitive jobs. Things like formatting names, fixing capitalization, converting currency, cleaning up genres, and formatting dates and times were all buried inside bigger components. Pulling them out into their own functions made everything much easier to read, and it kept the logic in one place instead of scattered all over the project.

Writing the tests first forced me to think more carefully about what each function should do. Defining the expected output, edge cases, and failure points ahead of time made the functions cleaner and more predictable. For example, deciding how proper case conversion should behave with mixed case names or long strings came from writing the tests, not from my initial code.

The hardest part of the refactor was untangling logic that didn’t really belong where it was. Some things were mixed together in ways that made it tough to separate without rewriting them. But having tests running in the background made spotting mistakes a lot easier.

In the end, the code is way nicer to work with. It’s cleaner, way more organized, and each function actually has a clear purpose now. The tests prove to me that things are working the way they’re supposed to, and the whole project feels easier to maintain and extend without breaking something.
