Here’s a cleaned-up and properly structured version of your Markdown document for the **Dicoding Story API**:

```markdown
# Dicoding Story

API untuk berbagi story seputar Dicoding, mirip seperti post Instagram namun khusus untuk Dicoding.

## Base URL

```

[https://story-api.dicoding.dev/v1](https://story-api.dicoding.dev/v1)

````

---

## Authentication

### Register

- **URL:** `/register`  
- **Method:** `POST`  
- **Request Body:**
  - `name`: string
  - `email`: string (must be unique)
  - `password`: string (minimum 8 characters)  
- **Response:**
```json
{
  "error": false,
  "message": "User Created"
}
````

### Login

* **URL:** `/login`
* **Method:** `POST`
* **Request Body:**

  * `email`: string
  * `password`: string
* **Response:**

```json
{
  "error": false,
  "message": "success",
  "loginResult": {
    "userId": "user-yj5pc_LARC_AgK61",
    "name": "Arif Faizin",
    "token": "<JWT token>"
  }
}
```

---

## Stories

### Add New Story

* **URL:** `/stories`
* **Method:** `POST`
* **Headers:**

  * `Content-Type`: `multipart/form-data`
  * `Authorization`: `Bearer <token>`
* **Request Body:**

  * `description`: string
  * `photo`: image file (max 1MB)
  * `lat`: float (optional)
  * `lon`: float (optional)
* **Response:**

```json
{
  "error": false,
  "message": "success"
}
```

### Add New Story (Guest)

* **URL:** `/stories/guest`
* **Method:** `POST`
* **Request Body:**

  * `description`: string
  * `photo`: image file (max 1MB)
  * `lat`: float (optional)
  * `lon`: float (optional)
* **Response:**

```json
{
  "error": false,
  "message": "success"
}
```

### Get All Stories

* **URL:** `/stories`
* **Method:** `GET`
* **Headers:**

  * `Authorization`: `Bearer <token>`
* **Query Parameters:**

  * `page`: int (optional)
  * `size`: int (optional)
  * `location`: `1` or `0` (optional, default: `0`)

    * `1`: get stories with location
    * `0`: get all stories without filtering by location
* **Response:**

```json
{
  "error": false,
  "message": "Stories fetched successfully",
  "listStory": [
    {
      "id": "story-FvU4u0Vp2S3PMsFg",
      "name": "Dimas",
      "description": "Lorem Ipsum",
      "photoUrl": "https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png",
      "createdAt": "2022-01-08T06:34:18.598Z",
      "lat": -10.212,
      "lon": -16.002
    }
  ]
}
```

### Get Story Detail

* **URL:** `/stories/:id`
* **Method:** `GET`
* **Headers:**

  * `Authorization`: `Bearer <token>`
* **Response:**

```json
{
  "error": false,
  "message": "Story fetched successfully",
  "story": {
    "id": "story-FvU4u0Vp2S3PMsFg",
    "name": "Dimas",
    "description": "Lorem Ipsum",
    "photoUrl": "https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png",
    "createdAt": "2022-01-08T06:34:18.598Z",
    "lat": -10.212,
    "lon": -16.002
  }
}
```

---

## Notifications (Web Push)

### VAPID Public Key

```
BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk
```

### Notification Schema

```json
{
  "title": "Story berhasil dibuat",
  "options": {
    "body": "Anda telah membuat story baru dengan deskripsi: <story description>"
  }
}
```

### Subscribe to Notifications

* **URL:** `/notifications/subscribe`
* **Method:** `POST`
* **Headers:**

  * `Authorization`: `Bearer <token>`
  * `Content-Type`: `application/json`
* **Request Body:**

  * `endpoint`: string
  * `keys`: object with `p256dh` and `auth` strings
* **Response:**

```json
{
  "error": false,
  "message": "Success to subscribe web push notification.",
  "data": {
    "id": "...",
    "endpoint": "...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    },
    "userId": "...",
    "createdAt": "..."
  }
}
```

### Unsubscribe from Notifications

* **URL:** `/notifications/subscribe`
* **Method:** `DELETE`
* **Headers:**

  * `Authorization`: `Bearer <token>`
  * `Content-Type`: `application/json`
* **Request Body:**

  * `endpoint`: string
* **Response:**

```json
{
  "error": false,
  "message": "Success to unsubscribe web push notification."
}
```

```

Would you like this saved or exported as a file?
```
