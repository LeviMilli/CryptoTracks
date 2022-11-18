# CryptoTracks

A user based fullstack web application that allows users to update wallet with current crypto holdings and prices are tracked in real time wtih coin api.



![crypto](https://user-images.githubusercontent.com/107660704/202800613-78c86931-d3f9-47ce-aab3-e0e1cc8dc707.JPG)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, MongoDB, Express

Full CRUD is ustilized in app. Each page is comprosed of react components and uses app context where it makes sense. Most states where set by context and a few function that were more globally used. The database was seeded using Mongo Atlas and node. Each page diplays object from database using arrays methods such as Map and Filter using react states. Auth was done by creating models of users and setting cookies and sessions. Personal recipes were done by references User and Recipe models.

## Optimizations
Allow additional coins and custom coins to be added and automatically searched with api. Allow users to store other data other than login and pre-selected list of coins.


## Lessons Learned:

When implementing live apis, its imperative to keep information clear and concise. Over complicating the data that is pulled from an api can make everything convoluted very quickly. Get the information that has previously been decided upon then improve after a working model is developed.

## Other Amazing Repos
Take a look at these couple repos that I have in my portfolio:

**foodSnitch fullstack detailed food recipe browser:** https://github.com/LeviMilli/foodSnitch-server

**MewTwo's Mad Dash Canvas HTML game:** https://github.com/LeviMilli/mewtwo-game

**The Notorius Codewars:** https://github.com/LeviMilli/Codewars


