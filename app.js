import { fetchMovieAvailability, fetchMovieList } from "./api.js"
const mainElement = document.getElementById('main');
const bookerGridHolder = document.getElementById('booker-grid-holder');
const bookTicketBtn = document.getElementById('book-ticket-btn');
const booker = document.getElementById('booker');

async function renderMovies() {
     mainElement.innerHTML = `<div id='loader'></div>`;
     let movies = await fetchMovieList();
     let movieHolder = document.createElement('div');
     movieHolder.setAttribute('class', 'movie-holder');
     movies.forEach(movie => {
          createSeparateMovieTabs(movie, movieHolder);
     });
     mainElement.innerHTML = '';
     mainElement.appendChild(movieHolder);
     setEventToLinks();
}
renderMovies();

function createSeparateMovieTabs(data, wrapper) {
     let a = document.createElement('a');
     a.setAttribute('data-movie-name', `${data.name}`);
     a.classList.add('movie-link');
     a.href = '#';
     let movieDiv = document.createElement('div');
     movieDiv.setAttribute('data-id', `${data.name}`);
     movieDiv.classList.add('movie');
     let movieDivWrapper = document.createElement('div');
     movieDivWrapper.classList.add('movie-img-wrapper');
     movieDivWrapper.style.backgroundImage = `url('${data.imgUrl}')`;
     let movieHeading = document.createElement('h4');
     movieHeading.innerText = data.name;
     movieDiv.appendChild(movieDivWrapper);
     movieDiv.appendChild(movieHeading);
     a.appendChild(movieDiv);
     wrapper.appendChild(a);
}
function setEventToLinks() {
     let movieLinks = document.querySelectorAll('.movie-link');
     movieLinks.forEach(movieLink => {
          movieLink.addEventListener('click', (e) => {
               renderSeatsGrid(movieLink.getAttribute('data-movie-name'));
          })
     })
}

async function renderSeatsGrid(movieName) {
     bookerGridHolder.innerHTML = `<div id='loader'></div>`;
     bookTicketBtn.classList.add('v-none');
     let data = await fetchMovieAvailability(movieName);
     renderLeftSeats(data);
     setEventsToSeats();
}

function renderLeftSeats(data) {
     bookerGridHolder.innerHTML = '';
     booker.firstElementChild.classList.remove('v-none');
     let bookingGrid1 = document.createElement('div');
     bookingGrid1.classList.add('booking-grid');
     for (let i = 0; i < 12; i++) {
          let seat = document.createElement('div');
          seat.setAttribute('id', `booking-grid-${i + 1}`);
          seat.classList.add('seat', 'available-seat');
          seat.innerText = i + 1;
          bookingGrid1.appendChild(seat);
     }
     bookerGridHolder.appendChild(bookingGrid1);
     renderRightSeats();
     data.forEach(seat => {
          let ele = document.getElementById(`booking-grid-${seat}`)
          ele.classList.add('unavailable-seat');
          ele.classList.remove('available-seat');
     })
}

function renderRightSeats() {
     let bookingGrid2 = document.createElement('div');
     bookingGrid2.classList.add('booking-grid');
     for (let i = 13; i <= 24; i++) {
          let seat = document.createElement('div');
          seat.setAttribute('id', `booking-grid-${i}`);
          seat.classList.add('seat', 'available-seat');
          seat.innerText = i;
          bookingGrid2.appendChild(seat);
     }
     bookerGridHolder.appendChild(bookingGrid2);
}
let seatsSelected = [];
function setEventsToSeats() {
     let AvaliableSeats = document.querySelectorAll('.available-seat');
     AvaliableSeats.forEach(seat => {
          seat.addEventListener('click', _ => {
               saveSelectedSeat(seat);
          })
     })
}

function saveSelectedSeat(seat) {
     if (!seat.classList.contains("selected-seat")) {
          seat.classList.add('selected-seat');
          seatsSelected.push(seat.innerText);
          bookTicketBtn.classList.remove('v-none');
     } else {
          seat.classList.remove('selected-seat');
          seatsSelected = seatsSelected.filter(item => seat.innerText !== item);
          if (seatsSelected.length == 0){
               bookTicketBtn.classList.add('v-none');
          }
     }
}

bookTicketBtn.addEventListener('click', () => {
     booker.innerHTML = '';
     confirmTicket();
})

function confirmTicket(){
     let confirmTicketElement = document.createElement('div');
     confirmTicketElement.setAttribute('id', 'confirm-purchase');
     let h3 = document.createElement('h3');
     h3.innerText = `Confirm your booking for seat numbers:${seatsSelected.join(",")}`;
     confirmTicketElement.appendChild(h3);
     let form = document.createElement('form');
     let formElements = `<input type="email" id="email" placeholder="email" required><br><br>
                         <input type="tel" id="phone" placeholder="phone" required><br><br>
                         <button id="submitBtn" type="submit">Submit</button>`;
     form.setAttribute('method', 'post');
     form.setAttribute('id', 'customer-detail-form');
     form.innerHTML = formElements;
     confirmTicketElement.appendChild(form);
     booker.appendChild(confirmTicketElement);
     success();
}

function success(){
     let submitBtn = document.getElementById('submitBtn');
     submitBtn.addEventListener('click',(e) => {
         let form =  document.getElementById('customer-detail-form');
         if(form.checkValidity()){
              e.preventDefault();
              let email = document.getElementById('email').value;
              let phone = document.getElementById('phone').value;
              renderSuccessMessage(email, phone);
         }
     })
}

function renderSuccessMessage(email, phone){
     booker.innerHTML = '';
     let successElement = document.createElement('div');
     successElement.setAttribute('id', 'Success');
     successElement.innerHTML = `<h3>Booking details</h3>
                               <p>Seats: ${seatsSelected.join(", ")}</p>
                              <p>Email: ${email}</p>
                              <p>Phone number: ${phone}</p>`;
     booker.appendChild(successElement);
}
