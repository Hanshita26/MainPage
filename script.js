const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector("#picSection .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    const groupSize = 4; // Number of images to show in each group
    let currentGroupIndex = 0; // Index of the current group of images

    let intervalId; // Variable to store the interval ID

    const startSlideshow = () => {
        clearInterval(intervalId); // Clear any existing interval
        intervalId = setInterval(() => {
            const direction = 1; // Next group of images
            const scrollAmount = imageList.clientWidth * direction * groupSize;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
            currentGroupIndex = (currentGroupIndex + 1) % Math.ceil(imageList.children.length / groupSize);
            updateText(); // Update the text below the images
            if (currentGroupIndex === 0) {
                clearInterval(intervalId); // Stop the slideshow after displaying all groups
                setTimeout(startSlideshow, 2000); // Start the slideshow again after 2 seconds
            }
        }, 2000); // Change group of images every 2 seconds
    };

    // Function to stop slideshow
    const stopSlideshow = () => {
        clearInterval(intervalId);
    };

    // Start slideshow on page load
    startSlideshow();

    // Stop slideshow when the user interacts with the slider
    imageList.addEventListener("scroll", () => {
        stopSlideshow();
    });

    // Restart slideshow when the user stops interacting with the slider
    imageList.addEventListener("mouseup", () => {
        startSlideshow();
    });

    // Rest of the code for slide buttons, scrollbar thumb, etc. remains the same

    // Function to update the text below the images
    const updateText = () => {
        const imageItems = imageList.querySelectorAll(".col-md");
        imageItems.forEach((item, index) => {
            const newIndex = (currentGroupIndex * groupSize) + index;
            const text = getTextForIndex(newIndex); // Define your function to get the text based on the image index
            const textElement = item.querySelector(".pic1"); // Assuming you have a specific class for the text below the image
            if (textElement) {
                textElement.textContent = text;
            }
        });
    };

    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction * groupSize;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
            currentGroupIndex = (currentGroupIndex + direction + Math.ceil(imageList.children.length / groupSize)) % Math.ceil(imageList.children.length / groupSize);
            updateText(); // Update the text below the images
        });
    });

    // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    }

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    // Call these two functions when image list scrolls
    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });
}

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);
