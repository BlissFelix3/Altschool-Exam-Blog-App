# Article/Blog App

This is an api for a blog app

---

## Requirements

1. User should have firstName, lastName, email, password
2. User should be able to signUp and signIn into blog app
3. JWT should expire after 1h
4. Logged in users should be able to create blogs
5. Blogs created should have body, title, description, tags, author, timestamp, state, read_count, reading_time
6. Both logged in and logged out users should be able to get all created blogs

   - should be 20 blogs per page.
   - It should also be searchable by author, title and tags.
   - It should also be orderable by read_count, reading_time and timestamp

7. Blog owners should be able to publish and draft created blogs using state
8. Both logged in and logged out users should get all published or drafted created blogs
9. Blog owners should be able to update both published and drafted created blogs
10. Both logged in and logged out users should get all updated published or drafted created blogs
11. Blog owners should be able to delete their blogs
12. Blog owners should be able to get a list of their created blogs
    - The endpoint should be paginated
    - It should be filterable by state
13. Single blog requested should return the user information with the blog. The read_count of the blog too should be updated by 1

---

## Setup

- Install NodeJS, mongodb
- pull this repo
- run `npm test`
- run `npm start`

---

## Base URL

- somehostsite.com

## Models

---

### User

| field     | data_type | constraints     |
| --------- | --------- | --------------- |
| id        | string    | required        |
| firstName | string    | required        |
| lastName  | string    | required        |
| email     | string    | required,unique |
| password  | string    | required        |

### Order

| field        | data_type | constraints                            |
| ------------ | --------- | -------------------------------------- |
| id           | string    | required                               |
| title        | string    | required, unique                       |
| description  | string    | required,default:1                     |
| tags         | array     | required                               |
| author       | string    | required                               |
| timestamps   | string    | required                               |
| state        | string    | required, enum: ['draft', 'published'] |
| read_count   | number    | required                               |
| reading_time | string    | optional                               |
| body         | string    | required                               |

## APIs

---

### SignUp User

- Route: /user/signup
- Method: POST
- Body:

```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstName": "jon",
  "lastName": "doe",
}
```

- Responses

Success

```
{
    message: 'Signup successful',
    user: {
        "_id": "<your id>",
        "firstName": "john",
        "lastName": "doe",
        "email": "doe@gmail.com",
        "blogs": [],
        "__v": 0
    }
}
```

---

### SignIn User

- Route: /user/signin
- Method: POST
- Body:

```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstName": "jon",
  "lastName": "doe",
}
```

- Responses

Success

```
{
    token: '<your token>'
}
```

---

### Create Blog

- Route: /blog
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:

```
{

    "title": "Altschool Africa",
    "description": "my desc",
    "tags": "@Altschool"
    "body": "Hello Altschool Africa hope y'all are chilling",
}
```

- Responses

Success

```
{
    "blog": {
        "title": "Altschool Africa",
        "description": "my desc",
        "author": "<author id>",
        "state": "draft",
        "read_count": 0,
        "reading_time": "2mins",
        "tags": [
            "@Altschool"
        ],
        "body": "Hello Altschool Africa hope y'all are chilling",
        "_id": "<blog id>",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>",
        "__v": 0
    }
}
```

---

### Get Blog

- Route: /blog/:id
- Method: GET
- Header
  - Authorization: Bearer {token}
- Responses

Success

```
{
        "blog": {
        "_id": "<blog id>",
        "title": "Altschool Africa",
        "description": "my desc",
        "author": {
            "_id": "<author id>",
            "firstName": "jon",
            "lastName": "doe",
            "email": "doe@example.com",
            "blogs": [
                "<blog id>",
            ],
        },
        "state": "draft",
        "read_count": 1,
        "reading_time": "2mins",
        "tags": [
            "@Altschool;"
        ],
        "body": "Hello Altschool Africa hope y'all are chilling",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>",
        "__v": 0
    }
}
```

---

### Get All Blogs

- Route: /blog
- Method: GET
- Header:
  - Authorization: Bearer {token}
- Query params:
  - page = (default: 1)
  - limit = (default: 20)
  - state = draft, published
  - author = john doe
  - title = Altschool Africa
  - tags = @Altschool
- Responses

Success

```
{
    "blogs": [
        {
            "_id": "<blog id>",
            "title": "Altschool Africa",
            "description": "my desc",
            "author": "<author id>",
            "state": "draft",
            "read_count": 0,
            "reading_time": "2mins",
            "tags": [
                "@Altschool"
            ],
            "body": "Hello Altschool Africa hope y'all are chilling",
            "createdAt": "<timestamp>",
            "updatedAt": "<timestamp>",
            "__v": 0
        }
    ]
}
```

## Note: it returns blog with default read_count: 0, except if single blog have been requested it will update by 1

### Get All Blogs By Order

- Route: /blog/order
- Method: GET
- Header:
  - Authorization: Bearer {token}
- Query params:

  - page = (default: 1)
  - limit = (default: 20)
  - readcount = ascending || descending
  - reading_time = ascending || descending
  - timestamps = ascending || descending

- Responses

Success

```
{
    "blogs": [
        {
            "_id": "<blog id>",
            "title": "Altschool Africa",
            "description": "my desc",
            "author": "<author id>",
            "state": "draft",
            "read_count": 0,
            "reading_time": "2mins",
            "tags": [
                "@Altschool"
            ],
            "body": "Hello Altschool Africa hope y'all are chilling",
            "createdAt": "<timestamp>",
            "updatedAt": "<timestamp>",
            "__v": 0
        }
    ]
}
```
Note: it returns the blog with the highest number of read_count if no params are entered
...

### Publish Blog State

- Route: /blog/:id
- Method: PATCH
- Header
  - Authorization: Bearer {token}

- Body:
``` 

{
    "state": "published"
}

- Responses

Success

```
{
        "blog": {
        "_id": "<blog id>",
        "title": "Altschool Africa",
        "description": "my desc",
        "author": "<author id>"
        "state": "published",
        "read_count": 1,
        "reading_time": "2mins",
        "tags": [
            "@Altschool;"
        ],
        "body": "Hello Altschool Africa hope y'all are chilling",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>",
        "__v": 0
    }
}
```
---

### UPDATE BLOG

- Route: /blog/:id
- Method: PUT
- Header
  - Authorization: Bearer {token}

- Body:
``` 

{
    "title": "Talent QL",
    "description": "my desc",
    "tags": "@TalentQL"
    "body": "Hello Talent QL hope y'all are chilling",
}

- Responses

Success

```
{
        "blog": {
        "_id": "<blog id>",
        "title": "Talent QL",
        "description": "my desc",
        "author": "<author id>"
        "state": "published",
        "read_count": 1,
        "reading_time": "2mins",
        "tags": [
            "@TalentQL;"
        ],
        "body": "Hello Talent QL hope y'all are chilling",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>",
        "__v": 0
    }
}
```

---

### Get User Blogs

- Route: /user/:id
- Method: GET
- Header:
  - Authorization: Bearer {token}
- Query params:

  - page = (default: 1)
  - limit = (default: 20)
  - state = draft, published

- Responses

Success

```
{
    "blogs": [
        {
            "_id": "<blog id>",
            "title": "Altschool Africa",
            "description": "my desc",
            "author": "<author id>",
            "state": "draft",
            "read_count": 0,
            "reading_time": "2mins",
            "tags": [
                "@Altschool"
            ],
            "body": "Hello Altschool Africa hope y'all are chilling",
            "createdAt": "<timestamp>",
            "updatedAt": "<timestamp>",
            "__v": 0
        }
    ]
}
```
...

### Delete Blog

- Route: /blog/:id
- Method: DELETE
- Header:
  - Authorization: Bearer {token}

- Responses

Success

```
{
    message: 'Blog has been successfully deleted'
}
```

---

## Contributor

- Abhademere Bliss
