# Touhou Database Search
This website intends to make searching for Touhou Albums easier.

# Usage
A hosted website is in the works. In the meantime, running app.py will host the website locally. Currently albums can be sorted via their name, genres, OSTs, circles and artists. Clicking any of resulting albums will bring up some extra information.

# Details
The database file itself is from @Solasan's work. Without it this wouldn't have been possible. app.py handles all of the backend, receiving requests for data and dishing it out from the database. 

# In the works
- Album Cover Art: albumArtScraper.py uses the TLMC path of various entries to find album cover data. Because the cover art files are not consistently named, it looks for keywords or the lowest numbered image. It works decently enough, albumArtScraper.py has successfully scraped out about 4k images. It names its output as the album_id for ease of access. Though, these images need further processing. Once this is done album cover art will be displayed in the results.
- UI Improvements: Changing the album info screen is a must. As well as implenting a dark screen mode (with a Renko theme perhaps?).
- User interaction: I might make it so that albums data can be added by users.
