// viewJobOffers.js

document.addEventListener('DOMContentLoaded', function () {
    let jobOffersData; // Store the original job offers data

    fetch('/getJobOffers') 
        .then(response => response.json())
        .then(jobOffers => {
            jobOffersData = jobOffers; // Store the original data for reference
            const jobOffersList = document.getElementById('job-offers');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const startSalaryInput = document.getElementById('startSalary');
            const endSalaryInput = document.getElementById('endSalary');
            const applySalaryFilterButton = document.getElementById('applySalaryFilter');
            const dateFilter = document.getElementById('dateFilter');
            const applyDateFilterButton = document.getElementById('applyDateFilter');

            function filterJobOffers(searchTerm, startSalary, endSalary, dateFilter) {
                return jobOffersData.filter(offer => {
                    const isSearchMatch = searchTerm === '' ||
                    Object.values(offer).some(property =>
                        property && property.toString().toLowerCase().includes(searchTerm)
                    );


                    const isSalaryMatch = (startSalary === '' || offer.salary >= startSalary) &&
                        (endSalary === '' || offer.salary <= endSalary);

                    const isDateMatch = checkDateFilter(offer.post_date, dateFilter);

                    return isSearchMatch && isSalaryMatch && isDateMatch;
                });
            }

            function checkDateFilter(postDate, selectedFilter) {
                const today = new Date();
                const postDateObj = new Date(postDate);

                switch (selectedFilter) {
                    case 'today':
                        return isSameDate(postDateObj, today);
                    case 'yesterday':
                        return isSameDate(postDateObj, new Date(today - 86400000));
                    case 'last7days':
                        return postDateObj >= new Date(today - 6 * 86400000);
                    case 'lastMonth':
                        return postDateObj >= new Date(today - 30 * 86400000);
                    case 'lastYear':
                        return postDateObj >= new Date(today - 365 * 86400000);
                    default:
                        return true; // No date filter
                }
            }

            function isSameDate(date1, date2) {
                return date1.getDate() === date2.getDate() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getFullYear() === date2.getFullYear();
            }

            function updateJobOffersList(filteredJobOffers) {
                jobOffersList.innerHTML = ''; // Clear the existing list

                filteredJobOffers.forEach(offer => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <p><b>Company:</b> ${offer.company_name}</p>
                        <p><b>Title:</b> ${offer.job_title}</p>
                        <p><b>Description:</b> ${offer.job_description}</p>
                        <p><b>Location:</b> ${offer.location}</p>
                        <p><b>Qualifications:</b> ${offer.qualification}</p>
                        <p><b>Salary:</b> ${offer.salary}</p>
                        <form action="/apply" method="post" enctype="multipart/form-data">
                            <input type="file" name="resume" accept=".pdf" required class="inputButton1">
                            <input type="hidden" name="job_post_id" value="${offer.job_post_id}">
                            <input type="submit" value="Apply" class="inputButton">
                        </form>
                    `;
                    jobOffersList.appendChild(listItem);
                });
            }

            function applyFilters() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                const startSalary = startSalaryInput.value.trim() !== '' ? parseFloat(startSalaryInput.value) : '';
                const endSalary = endSalaryInput.value.trim() !== '' ? parseFloat(endSalaryInput.value) : '';
                const selectedDateFilter = dateFilter.value;

                const filteredJobOffers = filterJobOffers(searchTerm, startSalary, endSalary, selectedDateFilter);
                updateJobOffersList(filteredJobOffers);
            }

            // Initial display of all job offers
            updateJobOffersList(jobOffersData);

            // Event listeners for search and filter buttons
            searchButton.addEventListener('click', applyFilters);
            applySalaryFilterButton.addEventListener('click', applyFilters);
            applyDateFilterButton.addEventListener('click', applyFilters);
        })
        .catch(error => console.error('Error fetching job offers:', error));
});
