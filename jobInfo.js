
document.addEventListener('DOMContentLoaded', function () {
    // Fetch job offers from the server
    fetch('/getJobInfo')
        .then(response => response.json())
        .then(jobInfo => {
            console.log('JobInfo:', jobInfo);
            const blogpostsList = document.getElementById('jobinfo');
            // console.log("job_post_id:", offer.job_post_id);
            // Loop through job offers and display them with an "Apply" button
            jobInfo.forEach(offer => {
                const listItem = document.createElement('li');
                // console.log("blogpost_id:", offer.PostId);
                 listItem.innerHTML = `
                    
                    <p><b>Platform:</b> ${offer.Platform}</p>
                    <p><b>Title:</b> ${offer.Title}</p>
                    <p><b>Company:</b> ${offer.Company}</p>
                    <p><b>Requirement:</b> ${offer.Requirement}</p>
                    <p><b>Experience:</b> ${offer.Experience}</p>
                    <p><b>Platform Link:</b> <a href="${offer.Link}" target="_blank">${offer.Link}</a></p>
                    
                   
                 
                `;
                blogpostsList.appendChild(listItem);

                
            });
        })
        .catch(error => console.error('Error fetching job offers:', error));

       
});
