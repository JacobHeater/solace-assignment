# Discussion on Further Improvements

## UI

- I would like to create a more robust user experience by utilizing
  existing design systems like MUI to ensure that the controls for
  the UI are consistent across pages.

- I would like to implement a more robust grid that allows for pagination,
  sorting, filtering, and more, perhaps also inspired by MUI, or another
  well-known grid.

## Backend

- I would like to abstract the database interactions utilizing design
  patterns, perhaps the repository pattern, and do so for the various
  tables in the database schema.

- I would like to implement API interactions for sorting, pagination,
  and other optimizations that would be necessary for larger data sets.

- I noticed an issue with `jsonb` serialization, and I believe it is a
  bug with drizzle-kit stringifying the specialties before they get
  stored in the database. I would spend more time researching a solution
  to this fix. Nonetheless, I was able to get around it by anticipating
  that column would be populated by doubly serialized data.

- I don't mind the full stack next.js application, but out of familiarity,
  I'd prefer to aim for an express backend for defining API interactions
  and routes.

## General Improvements

- I would add unit tests, API tests, and end-to-end tests.

## Final Thoughts

I believe I was able to make reasonable improvements to the user experience
and API layer in the allotted amount of time. I think I struck a good balance
between perfection and delivering value incrementally. There's always room
for improvement, but I'll wrap it up here.

## Thank You!

Thank you for the opportunity to work on this project. I really enjoyed working
on this. It was refreshing to work on something outside of cybersecurity where my
roots are well-established. I am looking forward to hearing your feedback.
