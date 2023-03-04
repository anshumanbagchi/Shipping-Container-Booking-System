
This is the readme file for the Container Ships Slot Booking System.


Planned Tech Stack:
    1. Express.js using Node.js
    2. MySQL server


Problem Statement:
You need to design an automated container ship slots booking system for the carrier service providers to allow shippers to book the slot without any 
human intervention. You can choose any backend tech stack of your choice.

User Stories:
As a shipper, I want to
    - Search for container ships based on source and destination country where I want to ship my cargo
    - Book slots in a manner such that these slots do not conflict with slots booked by other shippers
    - Be unable to book a ship whose all available slots are booked

Expectations:
    - Please derive the use cases of the platform. Out of all the user cases, please select any 5-8 use cases of your choice to define the APIs around them, 
    provided that it should not be very basic.
    - Please mention selected use case in the doc and submit the doc with the project submission.
    - Please define and design all the entities that could be involved in developing the platform.
    - Write comprehensive unit tests.
    - Perform functional testing
    - Please Dockerize your source code and define its dependent services in the Docker-compose file.
    - Please send the public github project link of your submission along with the project setup documentation

Basic Entities:
    1. User - contains userID - PK, userName, email
    2. Ship - contains shipID, Origin, Dest, TimeTaken, Capacity(Total slots), AvailableSlots
    4. Bookings - contains bookingID - PK, shipID - FK, userID - FK, no_of_slots, description

Use Cases and Routes:
    1. Add user (/user/add/)
    2. Remove user (/user/remove/)
    3. Edit user (/user/edit/)
    4. Add ship (/ship/add/)
    5. Edit ship (/ship/edit/)
    6. Remove ship (/ship/remove/)
    7. View All Ships (/ship/viewAll)
    8. View All Bookings (/book/viewAll)
    9. View All Users (user/viewAll)
    10. Book slot on ship (/book/new/)
    11. Remove booking from ship () (/book/remove/)
    12. Search Ship - based on shipID, origin or dest (/search/ship)
    13. Search Bookings - based on userID or shipID (/search/book)
    14. Server Status (/)
   
Currently implemented validations:
    1. Add user (/user/add/)
        - Checks if values are present for userName or email
       	- Checks if email already exists for another user
    2. Remove user (/user/remove/)
    	- Checks if value is present for userID
    	- Checks if userID is valid (must be present in User table)
    	- Checks to see if any current bookings present against the user and removes them before deleting user (if bookings are cancelled, available counts get updated for each ship)
    3. Edit user (/user/edit/)
    	- Checks to see any value present for userID
    	- Checks if userID is valid (must be present in User table)
    	- Checks if modified email already exists for another user
    4. Add ship (/ship/add/)
    	- Checks if values are present for origin, dest or timeTaken
    	- Assigns default capacity to 100 if not included in the request
    5. Edit ship (/ship/edit/)
    	- Checks if values are present for shipID
    	- Checks if shipID is valid (must be present in Ship table)
    	- Checks if new origin/destination is different from previous values and does not allow modification for these fields if any bookings are present currently
    	- Modifies capacity only if source and destination remain same and the new user input value is more than current number of bookings on the ship
    6. Remove ship (/ship/remove/)
    	- Checks if values are present for shipID
    	- Checks if shipID is valid (must be present in Ship table)
    	- Checks if any current bookings are present against the ship and removes them before deleting ship (no need to update available count as ship will be removed)
    7. View All Ships (/ship/viewAll)
    	- Checks to see if any ships present, otherwise displays custom 'No ships in table' message.
    8. View All Bookings (/book/viewAll)
    	- Checks to see if any ships present, otherwise displays custom 'No bookings in table' message.
    9. View All Users (user/viewAll)
    	- Checks to see if any users present, otherwise displays custom 'No users in table' message.
    10. Book slot on ship (/book/new/)
    	- Checks if values are present for shipID, userID and number of slots to be booked
    	- Checks if userID is valid (must be present in User table)
    	- Checks if shipID is valid (must be present in Ship table)
    	- Checks if number of slots to be booked is less than Ship Capacity
    	- Checks if number of slots to be booked are available on the ship
    11. Remove booking from ship () (/book/remove/)
    	- Checks if value present for bookingID
    	- Checks if bookingID is valid (must be present in Booking table)
    12. Search Ship - based on shipID, origin or dest (/search/ship)
    	- Allows only 1 field in request body - shipID, origin, dest.
    	- Checks if field provided in request body is exactly - shipID, origin, dest
    	- Checks to see if any ships present, otherwise displays custom 'No ships found' message.
    13. Search Bookings - based on userID or shipID (/search/book)
		- Allows only 1 field in request body - shipID, userID
    	- Checks if field provided in request body is exactly - shipID, userID
        - Checks if user/ship is present in the respective tables
    	- Checks to see if any ships present, otherwise displays custom 'No bookings found' message.

All APIs have been tested for happy paths as well as the validations using Postman and details can be found in ./PostmanRequests
I have included the .env file in the git upload for reference. I have only ignored ./node_modules in the git commit.
All APIs return valid HTTP status codes.
