# Suspend
### What
Website or app for saving content for later consumption
##### MVP
Single list with extremely simple UI - add entry button allows you to search a database of books, movies, and tv shows, and allows you to enter any of those, links to websites, or plain text.
- Ability to check entries off when consumed and to remove them if added by accident.
- No user authentication, accounts, or storage: everything should be stored locally or, if it's easier, it should be a global list that anyone can add to
##### Expansion
- Tag entries
- Write notes on entries
- Use ai to read lists of top 100 X and add each to your list
- Use ai to read text from a picture of a book or something and add it
- Section for 'learn later' and 'look up later'
- User accounts, authentication, and data storage
- Click on entries for more info like description and release date
- Automatically rename links
- Where to watch saved movies and shows
- Chrome Extension to Easily Save Pages like (now defunct) Omnivore Extension
### Why
- As far as I can tell there is no general 'watch later' app or site for all media types.
- The watch later parts of other apps are usually secondary considerations and have limited functionality (no tagging or ability to add notes (e.g. recommended by greg, this article is a list of movies to watch))
##### Competitors
While there's nothing I can find exactly like this, popular services with 'later' lists or that are 'later' lists for specific types of media are:
- Omnivore (only articles)
- are.na
- Youtube (only youtube videos)
- Letterboxd (only movies)
- MyAnimeList (only anime)
##### Business
While the goal is to make this service free and minimalist, I do see at least one clear route to money: ads can be hyper targeted. It's rare one service has information on someone beyond a single interest (the only exception I can think of being YouTube, Amazon, and Google Search).
### How
[Movie Database](https://www.omdbapi.com/), [Book Database](https://isbndb.com/apidocs/v2)
React. Tailwind? Vercel. Supabase? Something simpler?
