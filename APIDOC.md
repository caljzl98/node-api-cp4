# Book Summary API Documentation
The Book Summary API provides book summaries in 3 sentences by James Clear, but users can also
add their own summaries.

## Get a list of all books and their metadatas in a JSON object.
**Request Format:** /book-summaries/all

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns a list of all of the books and their metadatas that you can look up in this API.


**Example Request:** /book-summaries/all

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "10% Happier",
    "author": "Dan Harris",
    "summary": "Practicing meditation and mindfulness will make you at least 10 percent happier.     Being mindful doesn’t change the problems in your life, but mindfulness does help you respond     to your problems rather than react to them. Mindfulness helps you realize that striving for     success is fine as long as you accept that the outcome is outside your control."
  },
  {
    "id": 2,
    "title": "The 10X Rule",
    "author": "Grant Cardone",
    "summary": "The 10X Rule says that 1) you should set targets for yourself that are 10X greater     than what you believe you can achieve and 2) you should take actions that are 10X greater than     what you believe are necessary to achieve your goals. The biggest mistake most people make in     life is not setting goals high enough. Taking massive action is the only way to fulfill your     true potential."
  },
  ...
]
```

**Error Handling:**
- N/A

## Look up a book's metadata by their book id.
**Request Format:** /book-summaries/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a valid id, it returns a JSON of the book's metadata.

**Example Request:** /book-summaries/5

**Example Response:**
*Fill in example response in the {}*

```json
{
  "id": 5,
  "title": "The Art of War",
  "author": "Sun Tzu",
  "summary": "Know when to fight and when not to fight: avoid what is strong and strike at what     is weak. Know how to deceive the enemy: appear weak when you are strong, and strong when you     are weak. Know your strengths and weaknesses: if you know the enemy and know yourself, you     need not fear the result of a hundred battles."
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid book id, returns an error with the message: `Given id: {id} is not found.`
  - If passed in anything other than an integer, returns an error with the message: `Param is not set properly. (integer only)`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Uh oh. Something went wrong. Please try again later.`

## Look up a book's title by their id
**Request Format:** /book/:id

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Given a valid id, it returns the title of the book based on the book id.

**Example Request:** /book/2

**Example Response:**
The 10X Rule

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid book id, returns an error with the message: `Given id: {id} is not found.`
  - If passed in anything other than an integer, returns an error with the message: `Param is not set properly. (integer only)`

## Add a book
**Request Format:** /add-book endpoint with POST parameters of `title`, `author`, and `summary`.

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description:** Given a valid book `title`, `author`, and `summary`, a success message will be sent as a response.

**Example Request:** /add-book with POST parameters of `title=Love Yourself Like Your Life Depends On It`, `author=Kamal Ravikant` and `summary=Everyone has a truth that they need to live and share. For the author, that truth was committing to the daily practice of repeating the phrase “I love myself.” When you love yourself, life loves you back.`

**Example Response:**
```
Success! Love Yourself Like Your Life Depends On It's summary has been added.
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an existing book title, an error is returned with: {title}'s summary has already been added.
  - If any of the parameters are missing, an error is returned with: Body param not set properly.
