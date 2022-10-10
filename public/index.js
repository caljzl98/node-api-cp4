/**
 * Name:     Calvin Jun Zhong Lim
 * Date:     May 19, 2022
 * Section:  CSE 154 AB
 *
 * This is the JS to implement the UI for cp4.
 * Initially, the webpage will fetch from an API and build upon the existing DOM with
 * lists of book titles. Upon clicking on the book titles, their metadatas will toggle their views.
 * Upon filling the form for adding a book, a POST method will be executed, and the book list will
 * refresh to reflect the action made.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * Fetches from the Book Summary API to fill webpage with content, and adds functionality
   * to adding a book and showing the form to be filled.
   */
  function init() {
    getContent();
    id("add-book-form").addEventListener("submit", (event) => {
      event.preventDefault();
      addBook();
    });
    id("add-button").addEventListener("click", showForm);
  }

  /**
   * Based on valid input in the form, add a book in the server-side of Book Summary API.
   */
  function addBook() {
    let bookTitle = qs("input[name=book-title]").value;
    let authorName = qs("input[name=author]").value;
    let summary = concatSummary();

    let data = new FormData();
    data.append("title", bookTitle);
    data.append("author", authorName);
    data.append("summary", summary);
    fetch("/add-book", {method: "post", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(refreshContent)
      .catch(handleError);
  }

  /**
   * Callback funciton to show the form for adding a book.
   */
  function showForm() {
    id("add-book-form").classList.toggle("hidden");
  }

  /**
   * Helper function to concatenate the 3 sentences from the form as a summary.
   * @returns {string} 3 sentence summary of a book.
   */
  function concatSummary() {
    let sentence1 = qs("input[name=summary-1]").value;
    let sentence2 = qs("input[name=summary-2]").value;
    let sentence3 = qs("input[name=summary-3]").value;

    return sentence1 + " " + sentence2 + " " + sentence3;
  }

  /**
   * Fetches from Book Summary API to get a list of JSON containing the books and their metadatas,
   * and fill the webpage with an unordered list of them.
   */
  function getContent() {
    fetch("/book-summaries/all")
      .then(statusCheck)
      .then(res => res.json())
      .then(updateContent)
      .catch(handleError);
  }

  /**
   * Callback function that helps create a nested unordered list containing relevant metadatas of
   * of books passed in as argument.
   * @param {object[]} res - Javascript Object returned from fetch with endpoint
   * "/book-summaries/all", which is an array of objects containing id, title, author, and summary.
   */
  function updateContent(res) {
    res.forEach((book) => {
      let bookTitle = book.title;
      let author = book.author;
      let summary = book.summary;
      createBook(bookTitle, author, summary);
    });
  }

  /**
   * Callback function for when adding a book using the POST method,
   * refresh the current list of books and their metadatas, to reflect the updated
   * list of books.
   */
  function refreshContent() {
    id("books").innerHTML = "";
    getContent();
  }

  /**
   * Helper function that generates the necessary elements to be appended onto #books.
   * Classes are also added here.
   * @param {string} bookTitle - Title name for the book being added onto the list of books.
   * @param {string} author - Name of the author for the book being added.
   * @param {string} summary - 3 sentence summary for the book being added.
   */
  function createBook(bookTitle, author, summary) {
    let bookList = id("books");

    let metaDataList = gen("li");
    bookList.appendChild(metaDataList);

    let bookTitleSpan = gen("span");
    bookTitleSpan.addEventListener("click", function(event) {
      toggleMetaData(event);
    });
    bookTitleSpan.textContent = bookTitle;
    bookTitleSpan.classList.add("book-title");
    metaDataList.appendChild(bookTitleSpan);

    let bookMetaDataList = gen("ul");
    let authorList = listWithSpan("Author: ", author, "author-name");
    let summaryList = listWithSpan("3-Sentence Summary: ", summary, "summary");
    bookMetaDataList.appendChild(authorList);
    bookMetaDataList.appendChild(summaryList);
    bookMetaDataList.classList.add("hidden");
    metaDataList.appendChild(bookMetaDataList);
  }

  /**
   * Helper function to generate a list with a span element as its child.
   * @param {string} listText - The text content for the list element.
   * @param {string} spanText - The text content for the span element.
   * @param {string} spanClass - The class to be added onto the span element.
   * @returns {HTMLElement} A list element with a span element as its child.
   */
  function listWithSpan(listText, spanText, spanClass) {
    let list = gen("li");
    list.textContent = listText;
    let span = gen("span");
    span.textContent = spanText;
    span.classList.add(spanClass);
    list.appendChild(span);
    return list;
  }

  /**
   * Callback function for showing/hiding a book's metadata when a book's title is being clicked.
   * @param {Event} event - The event where the "click" happens.
   */
  function toggleMetaData(event) {
    let bookMetaDataList = event.currentTarget.nextSibling;
    bookMetaDataList.classList.toggle("hidden");
  }

  /**
   * Callback function for when the fetch request is rejected. Hides the main content on the webpage
   * and shows the error page, with an error message.
   * @param {string} res - Error message returned from the response to an API call.
   */
  function handleError(res) {
    id("main-body").classList.add("hidden");
    id("error-body").classList.remove("hidden");
    qs("#error-body p").textContent = "ERROR: " + res;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Returns the Response object if the response returned from fetch is returned successfully,
   * else throw an error.
   * @param {Response} response - the response to a request made to the API
   * @returns {Error} When param response is unsuccessful, throw an error with
   * an error message fetched from the API.
   * @returns {Response} the response to a request made to the API
   */
  async function statusCheck(response) {
    // response = Response object from fetch
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();