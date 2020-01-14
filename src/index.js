// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
let likeData = []
const localUrl = 'http://localhost:3000/'
const quoteUrl = localUrl + 'quotes?_embed=likes'
const likesUrl = localUrl + 'likes/'




fetchQuotes()
fetchLikes()

const form = document.querySelector('#new-quote-form')
    // const form = document.querySelector('btn btn-primary')
form.addEventListener('submit', (e) => {createQuote(e)})





function fetchLikes(url){
    fetch(likesUrl).then(res => res.json()).then(data => {
        likeData = data
        // console.log(likeData)
    })
}


function fetchQuotes(){
    fetch(quoteUrl).then(res => res.json()).then(data => displayInfo(data))
}



function displayInfo(data){
    data.forEach(quote => displayQuote(quote))
    
}


function displayQuote(quote){

    console.log(quote)
    const ul = document.querySelector('#quote-ul')
    const li = document.createElement('li')
    li.className = 'quote-card';
    const block = document.createElement('blockquote')
    block.className =  'blockqoute'
    const p = document.createElement('p')
    p.textContent = quote.quote
    p.className = 'mb-0'
    block.appendChild(p)

    const footer = document.createElement('footer')
    footer.textContent = quote.author
    footer.className = 'blockquote-footer'
    block.appendChild(footer)

    const br = document.createElement('br')
    block.appendChild(br)

    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-success'
    likeBtn.textContent = 'Likes:'

    const span = document.createElement('span')
    if (quote.likes){
      span.textContent = quote.likes.length  
    }else{
        span.textContent = 0
    }
    
    likeBtn.appendChild(span)

    likeBtn.addEventListener('click', (e) => createLike(e, quote))


    block.appendChild(likeBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = ' Delete'
    deleteBtn.className = "btn-danger"
    deleteBtn.addEventListener('click',(e) => deleteQuote(e, quote))
    block.appendChild(deleteBtn)
    
    li.appendChild(block)
    ul.appendChild(li)

}



function createLike(e, quote){
    console.log(quote)
    // console.log(?
    fetch('http://localhost:3000/likes',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ quoteId: quote.id })
    }).then(res => res.json()).then(data => {
        const button = e.target
        const span = e.target.querySelector('span')
        span.textContent = parseInt(span.textContent) + 1
        button.appendChild(span)
    }
    )


}


function deleteQuote(e, quote){

    console.log(e.target.parentElement.parentElement)

    fetch(`http://localhost:3000/quotes/${quote.id}`,{
        method: 'DELETE'
    }).then(res => res.json()).then( data => {
        e.target.parentElement.parentElement.remove()
    })
}



   


function createQuote(e){
    console.log(e.target)
    let UserQuote = e.target.querySelector('#new-quote').value 
    let UserName = e.target.querySelector('#author').value
    console.log(UserQuote)
    console.log(UserName)

    fetch('http://localhost:3000/quotes',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: UserQuote, author: UserName})
    }).then(res => res.json()).then(quote => {displayQuote(quote)})


    event.preventDefault();
}


