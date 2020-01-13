const BASE_URL = 'http://localhost:3000'
const QUOTES_URL = BASE_URL+'/quotes'

let QUOTE_LIST

let ALL_QUOTES = []

let SORTING = false


function toggleSorting() {
    SORTING = !SORTING
}

function updateSortButton() {
    const sortButton = document.querySelector('#sort-button')
    const baseText = 'Sort by Author: '

    SORTING ? sortButton.textContent = baseText + 'ON' : sortButton.textContent = baseText + 'OFF'
}

function postNewQuote(quoteText, quoteAuthor) {

    message = {
        quote: quoteText,
        author: quoteAuthor
    }

    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    }
    fetch(QUOTES_URL, options)
    .then(res => res.json())
    .then(quote => {
        QUOTE_LIST.appendChild(renderQuote(quote))
    })
}


function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function updateQuote(quoteText, quoteAuthor, quoteItem) {
    message = {
        quote: quoteText,
        author: quoteAuthor
    }

    options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    }
    fetch(QUOTES_URL+`/${quoteItem.id}`, options)
    .then(res => res.json())
    .then(quote => {
        QUOTE_LIST.appendChild(renderQuote(quote, quoteItem))
    })
}

function handleFormSubmit(e) {
    e.preventDefault()
    const quoteText = e.target['quote-text'].value
    const quoteAuthor = e.target['quote-author'].value

    const quoteId = e.target.dataset.quoteId
    if (quoteId) {
        updateQuote(quoteText, quoteAuthor, document.getElementById(quoteId))
    } else {
        postNewQuote(quoteText, quoteAuthor, 'POST')
    }
    e.target.reset()
}

function updateLikeCount(likeButton) {
    const likeCount = likeButton.querySelector('span')
    let likes = parseInt(likeCount.textContent)
    likes += 1
    likeCount.textContent = likes
}

function clickLike(e) {
    message = {
        quoteId: parseInt(e.target.dataset.quoteId),
        createdAt: Date.now()
    }

    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    }
    fetch(BASE_URL+'/likes', options)
    .then(res => res.json())
    .then(like => updateLikeCount(e.target))
}

function clickDelete(e) {
    const quoteId = e.target.dataset.quoteId
    fetch(QUOTES_URL+`/${quoteId}`, {method: 'DELETE'})
    .then(res => res.json())
    .then(quote => e.target.parentElement.parentElement.remove())
}

function clickEditButton(quote, quoteItem) {
    // console.log(e.target.parentElement.parentElement)
    const form = document.querySelector('#new-quote-form')
    form['quote-text'].value = quote.quote
    form['quote-author'].value = quote.author
    form.dataset.quoteId = quote.id
}

function renderQuote(quote, updatedLi) {

    let quoteItem 
    
    if (updatedLi) {
        quoteItem = updatedLi
        clearElement(quoteItem)
        const itemIndex = ALL_QUOTES.findIndex(item => item.id === quote.id)
        ALL_QUOTES[itemIndex] = quote
    } else {
        quoteItem = document.createElement('li')
        quoteItem.className = 'quote-card'
        quoteItem.id = quote.id
    }


    const quoteBlock = document.createElement('blockquote')
    quoteBlock.className = 'blockquote'
    
    const quoteElement = document.createElement('p')
    quoteElement.className = 'mb-0'
    quoteElement.textContent = quote.quote

    const quoteAuthor = document.createElement('footer')
    quoteAuthor.className = 'blockquote-footer'
    quoteAuthor.textContent = quote.author

    const breakElement = document.createElement('br')

    const likeButton = document.createElement('button')
    likeButton.className = 'btn-success'
    likeButton.textContent = 'Likes: '
    likeButton.addEventListener('click', clickLike)
    likeButton.dataset.quoteId = quote.id

    const likeCount = document.createElement('span')

    if (quote.likes !== undefined) {
        likeCount.textContent = quote.likes.length
    } else {
        likeCount.textContent = 0
    }

    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn-danger'
    deleteButton.textContent = 'Delete'
    deleteButton.dataset.quoteId = quote.id
    deleteButton.addEventListener('click', clickDelete)

    const editButton = document.createElement('button')
    editButton.className = 'btn-info'
    editButton.textContent = 'Edit'
    editButton.dataset.quoteId = quote.id
    editButton.addEventListener('click', (e) => {
        clickEditButton(quote, quoteItem)
    })

    likeButton.appendChild(likeCount)

    quoteBlock.appendChild(quoteElement)
    quoteBlock.appendChild(quoteAuthor)
    quoteBlock.appendChild(breakElement)
    quoteBlock.appendChild(likeButton)
    quoteBlock.appendChild(deleteButton)
    quoteBlock.appendChild(editButton)

    quoteItem.appendChild(quoteBlock)

    return quoteItem
}

function loadAllQuotes() {
    clearElement(QUOTE_LIST)

    const url = SORTING ? QUOTES_URL+'?_embed=likes&_sort=author' : QUOTES_URL+'?_embed=likes'

    fetch(url)
    .then(res => res.json())
    .then(quotes => {
        for (quote of quotes) {
            ALL_QUOTES.push(quote)
            QUOTE_LIST.appendChild(renderQuote(quote))
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    QUOTE_LIST = document.querySelector('#quote-list')
    loadAllQuotes()
    const form = document.querySelector('#new-quote-form')
    form.addEventListener('submit', (e) => {
        handleFormSubmit(e)
    })

    const sortButton = document.querySelector('#sort-button')
    sortButton.addEventListener('click', (e) => {
        toggleSorting()
        updateSortButton()
        loadAllQuotes()
    })
})