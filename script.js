document.addEventListener("DOMContentLoaded", function () {
    const slots = document.querySelectorAll(".slot");
    const form = document.getElementById("booking-form");
    const selectedSlot = document.getElementById("selected-slot");
    const bookerNameInput = document.getElementById("booker-name");
    const bookingDateInput = document.getElementById("booking-date");
    const hoursInput = document.getElementById("hours");
    const minutesInput = document.getElementById("minutes");
    const confirmButton = document.getElementById("confirm-booking");
    const cancelButton = document.getElementById("cancel-booking");

    let activeSlot = null;
    let timers = {};

    // When a slot is clicked
    slots.forEach(slot => {
        slot.addEventListener("click", function () {
            if (slot.classList.contains("occupied")) return;
            activeSlot = slot;
            selectedSlot.textContent = slot.dataset.slot;
            form.classList.remove("hidden");
        });
    });

    // Confirm booking
    confirmButton.addEventListener("click", function () {
        let bookerName = bookerNameInput.value.trim();
        let bookingDate = bookingDateInput.value;
        let hours = parseInt(hoursInput.value) || 0;
        let minutes = parseInt(minutesInput.value) || 0;

        if (!bookerName || !bookingDate || (hours === 0 && minutes === 0)) {
            alert("Please fill all fields correctly.");
            return;
        }

        let slotNumber = activeSlot.dataset.slot;
        let duration = (hours * 60 + minutes) * 60 * 1000; // Convert to milliseconds
        let endTime = new Date().getTime() + duration;

        // Save booking details
        activeSlot.innerHTML = `
            🚗 Booked<br>
            ${bookingDate}<br>
            <span class="timer" data-end="${endTime}"></span>
        `;
        activeSlot.classList.add("occupied");

        // Start countdown
        timers[slotNumber] = setInterval(() => updateTimer(slotNumber, endTime), 1000);

        // Hide form & clear input
        form.classList.add("hidden");
        bookerNameInput.value = "";
        bookingDateInput.value = "";
        hoursInput.value = "";
        minutesInput.value = "";
    });

    // Cancel booking
    cancelButton.addEventListener("click", function () {
        form.classList.add("hidden");
    });

    // Update the countdown timer
    function updateTimer(slotNumber, endTime) {
        let now = new Date().getTime();
        let remainingTime = endTime - now;

        if (remainingTime <= 0) {
            clearInterval(timers[slotNumber]);
            let slot = document.querySelector(`[data-slot="${slotNumber}"]`);
            slot.innerHTML = `Slot ${slotNumber}`;
            slot.classList.remove("occupied");
        } else {
            let hours = Math.floor(remainingTime / (1000 * 60 * 60));
            let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            let timerSpan = document.querySelector(`[data-slot="${slotNumber}"] .timer`);
            if (timerSpan) {
                timerSpan.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }
    }
});
