$(document).ready(function () {
    // Click event for tab selection
    $(".tab").click(function () {
        // Remove active class from all tabs
        $(".tab").removeClass("active");
        // Add active class to the clicked tab
        $(this).addClass("active");

        // Get the index of the clicked tab
        var tabIndex = $(this).index();

        // Hide all content rows
        $(".content-row").removeClass("active");
        // Show the corresponding content row for the clicked tab
        $(".content-row").eq(tabIndex).addClass("active");
    });

    // Show the default active tab content on page load
    $(".tab.active").click();
});
