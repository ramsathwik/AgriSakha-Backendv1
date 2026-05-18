## Overview

The **agriSakha API** appears to power an agriculture-focused platform that includes:

- user registration and login
- OTP verification flows
- profile updates
- crop and tip management
- categorization of crops and tips
- social engagement through likes
- contact management
- hierarchical location lookup

The collection is structured in a modular way, making it easy to maintain and extend.

---

## Features

- User authentication and session handling
- OTP-based verification
- Profile update workflows
- CRUD operations for crops
- CRUD operations for crop categories
- CRUD operations for tips
- CRUD operations for tip categories
- Save and like tip functionality
- Contact management APIs
- Location lookup APIs for states, districts, mandals, and villages

---

## Tech Structure

The API follows a REST-style structure and uses versioned endpoints:

```http
/api/v1
The Postman collection is organized into the following folders:

auth
location
tipCategory
tip
like
profile
contacts
cropCategory
crop
Base URL
All endpoints use the environment variable:

baseurl
Example:

baseurl=http://localhost:8000
Base endpoint pattern:

{{baseurl}}/api/v1
Environment Setup
Before using the collection:

Open the
agriSakha
 collection.
Select the active environment: New Environment.
Set the baseurl variable to your running backend URL.
Run authentication endpoints first if secured routes require login.
Example:

baseurl=http://localhost:8000
Authentication Flow
Based on the requests in the
auth
 folder, the likely authentication flow is:

Register user
Send OTP
Verify OTP
Login user
Fetch current user
Refresh token
Logout user
Suggested sequence:

register-user
sendOtp
verify-otp
user-login
me
refreshAccessToken
logout
API Modules
Auth
Authentication and user account management endpoints from
auth
.

Method	Endpoint	Description
POST	/api/v1/user/register-user	Register a new user account
POST	/api/v1/user/send-otp	Send OTP for verification
POST	/api/v1/user/verify-otp	Verify OTP submitted by the user
POST	/api/v1/user/login-user	Authenticate user and start session/token flow
POST	/api/v1/user/refresh	Refresh access token/session
POST	/api/v1/user/logout-user	Logout current user
GET	/api/v1/user/me	Get authenticated user details
Requests:

register-user
sendOtp
verify-otp
user-login
refreshAccessToken
logout
me
Profile
Profile-related endpoints from
profile
.

Method	Endpoint	Description
POST	/api/v1/profile/send-otp	Send OTP for profile verification/update
POST	/api/v1/profile/verify-otp	Verify profile-related OTP
POST	/api/v1/profile/update-profile	Update user profile information
Requests:

send-otp
verify-otp
update-profile
Location
Location hierarchy endpoints from
location
.

Method	Endpoint	Description
GET	/api/v1/location/get-states	Get all states
GET	/api/v1/location/get-districts?state={stateId}	Get districts by state
GET	/api/v1/location/get-mandals?district={districtId}	Get mandals by district
GET	/api/v1/location/get-mandals?district={districtId}	Request named getvillages, likely intended for villages
Requests:

getstates
get districts
getmandals
getvillages
Note: getvillages currently points to the same visible URL as getmandals, so this should be verified.

Tip Category
Endpoints from
tipCategory
.

Method	Endpoint	Description
POST	/api/v1/tipCategory/add-category	Create a tip category
GET	/api/v1/tipCategory/get-categories	Get all tip categories
PATCH	/api/v1/tipCategory/update-category/{categoryId}	Update a tip category
DELETE	/api/v1/tipCategory/delete-category/{categoryId}	Delete a tip category
Requests:

add-category
get-categories
update tipcategory
delete-category
Tip
Endpoints from
tip
.

Method	Endpoint	Description
POST	/api/v1/tip/add-tip	Create a new tip
GET	/api/v1/tip/get-tips	Get all tips
GET	/api/v1/tip/get-tip/{tipId}	Get a specific tip by ID
PATCH	/api/v1/tip/update-tip/{tipId}	Update tip by ID
DELETE	/api/v1/tip/delete-tip/{tipId}	Delete tip by ID
GET	/api/v1/tip/category/{categoryId}	Get tips by category
POST	/api/v1/tip/save-tip/{tipId}	Save/bookmark a tip
Requests:

addtip
getTips
getTipById
updateTip
deleteTip
tipsByCategory
save-tip
Like
Endpoints from
like
.

Method	Endpoint	Description
POST	/api/v1/like/toggle-like/{resourceId}	Toggle like state for a resource, likely a tip
Request:

togglelike
Contacts
Endpoints from
contacts
.

Method	Endpoint	Description
POST	/api/v1/contact/add-contact	Create a new contact
GET	/api/v1/contact/get-contacts	Get contacts
GET	/api/v1/contact/get-all-contacts	Get all contacts
PATCH	/api/v1/contact/update-contact/{contactId}	Update contact by ID
DELETE	/api/v1/contact/delete-contact/{contactId}	Delete contact by ID
Requests:

add-contact
get-contacts
get-all-contacts
update-contact
delete-contact
Crop Category
Endpoints from
cropCategory
.

Method	Endpoint	Description
POST	/api/v1/cropCategory/add-category	Create crop category
GET	/api/v1/cropCategory/get-categories	Get crop categories
PATCH	/api/v1/cropCategory/update-category/{categoryId}	Update crop category
DELETE	/api/v1/cropCategory/delete-category/{categoryId}	Delete crop category
Requests:

add-category
get-categories
update-category
delete-category
Crop
Endpoints from
crop
.

Method	Endpoint	Description
POST	/api/v1/crop/add-crop	Create a new crop
GET	/api/v1/crop/get-crops	Get all crops
GET	/api/v1/crop/get-crop/{cropId}	Get crop by ID
PATCH	/api/v1/crop/update-crop/{cropId}	Update crop by ID
DELETE	/api/v1/crop/delete-crop/{cropId}	Delete crop by ID
Requests:

add-crop
get-crops
get-crop
update-crop
delete-crop
Module Summary
Module	Responsibility
Auth	User registration, OTP, login, refresh, logout, current-user lookup
Profile	Profile verification and update
Location	Geographic hierarchy lookup
Tip Category	Tip category management
Tip	Tip lifecycle and retrieval
Like	Like/unlike interaction
Contacts	Contact management
Crop Category	Crop category management
Crop	Crop lifecycle management

Maintainer Suggestion
If this GitHub repository contains backend source code, you may also add:

project setup instructions
installation steps
environment variables list
database configuration
run commands
test commands
deployment notes
Example:

npm install
npm run dev
```
