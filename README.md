# Desolate Hollows v2

A 2nd version of the Desolate Hollows project. In this version, Users are combining
items in order to match saved recipes. Uses a customized backend express template
to hold information about the various recipes, and to create a save game state
for the user. Aiming for ambiance & a calming puzzle experience.

![Screenshot](https://imgur.com/QkwPC49)

### Links for SEI 04 Full Stack Project

#### Front-end
* https://sorenhopkins.github.io/desolateHollowsV2-client/#/
* https://github.com/SorenHopkins/desolateHollowsV2-client

#### Back-end
* http://shrouded-ridge-13366.herokuapp.com/
* https://github.com/SorenHopkins/desolateHollowsV2-Server

## Front-end Technologies Used
* HTML5
* React
* CSS
* SASS
* Bootstrap
* Axios

## Back-end Technologies Used
* Express
* Mongoose
* MongoDB
* JavaScript

# Planning:
### Back-end Repository
* Routes are decidedly unRESTful
* Recipe route exists to check for a match to ingredients provide in brew, returns recipe item
* Post checks if a user has an Inventory item. If so, returns Inventory. If not, creates Inventory.
* Consumer should only have one Inventory.
* Patch also returns the patched Inventory.

| Resource | Route | Action |
|---|---|---|
| Inventory  | /hangouts | Get (index) |
| Inventory  | /hangouts/:id  | Update |
| Inventory  | /hangouts  | Post |
| Recipe  | /recipe/checkMatch | Post  |

### Front-end Repository
* Did not create wireframes before beginning, which created problems!
* Created the following wireframe partways through development:
![Wireframe](https://imgur.com/LXFbeYU)

### User Stories:
* As a user I would like to select ingredients to use
* As a user I would like to combine those ingredients to make a potion
* As a user I would like to get a new ingredient upon using a potion
* As a user I would like to have my progress saved when I log in
* As a user I would like to avoid getting duplicate objects
* As a user I would like to be limited to viable solutions

# Development Process and Problem Solving
* Came into the process with relatively little pre-planning other than thoughts about resources
* Ended up taking very different approaches to several problems that I originally anticipated.
* Ran into a number of issues around patch requests that could've been resolved by catching stray parentheses.
* Struggled for a bit with passing information around in react properly.

### Difficulties Faced
* As above, patch requests.
* I feared my promise chains were not working correctly, but it was mainly an issue of failing to write my functions the way the code was expecting.

## Goals for Future Versions and Unsolved Issues
### Goals
* Improve the design. At the moment it only works (and barely) on a specific browser size.
* I'd also like to change the buttons and add animations on potion use.
* Adding more game mechanics could be fun:
  - A representation of the state of the Hollow according to brewed potions.
  - A hint system for what ingredients to use.
  - Additional game mechanics to get more ingredients- like a basic rpg combat system- could be very fun.

### Unsolved Issues
* Struggling with layout & css. Made a great amount of progress, still need to do more!
* Optimizing for mobile.
* Not all objects have proper keys.
* Changing audio player to just be a play button would improve aesthetic.
* Need skip button for intro.
