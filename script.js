const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const bookBtn = document.getElementById('book-btn');

let ticketPrice = +movieSelect.value;

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

    animateValue(count, count.innerText, selectedSeatsCount, 500);
    animateValue(total, total.innerText, selectedSeatsCount * ticketPrice, 500);
}

// Get data from local storage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    if (bookedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (bookedSeats.indexOf(index) > -1) {
                seat.classList.add('booked');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

// Animate value change
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Movie select event
movieSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

// Seat click event
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied') && !e.target.classList.contains('booked')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

// Book button click event
bookBtn.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat before booking.');
        return;
    }

    const bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];

    selectedSeats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('booked');
        const seatIndex = [...seats].indexOf(seat);
        if (!bookedSeats.includes(seatIndex)) {
            bookedSeats.push(seatIndex);
        }
    });

    localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));
    localStorage.removeItem('selectedSeats');
    updateSelectedCount();

    // Animate button
    bookBtn.textContent = 'Booked!';
    bookBtn.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        bookBtn.textContent = 'Book Now';
        bookBtn.style.backgroundColor = '';
    }, 2000);

    alert('Booking successful! Enjoy your movie.');
});

// Initial count and total set
updateSelectedCount();

// Populate UI with saved data
populateUI();

// Add hover effect to seats
seats.forEach(seat => {
    seat.addEventListener('mouseenter', () => {
        if (!seat.classList.contains('occupied') && !seat.classList.contains('booked')) {
            seat.style.transform = 'scale(1.2)';
            seat.style.transition = 'transform 0.3s ease';
        }
    });

    seat.addEventListener('mouseleave', () => {
        if (!seat.classList.contains('occupied') && !seat.classList.contains('booked')) {
            seat.style.transform = 'scale(1)';
        }
    });
});