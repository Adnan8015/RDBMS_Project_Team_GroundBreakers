document.addEventListener('DOMContentLoaded', function () {
    // Fetch job offers from the server
    fetch('/getBlogPostsJobseeker')
        .then(response => response.json())
        .then(blogposts => {
            console.log('blogposts:', blogposts);
            const blogpostsList = document.getElementById('blogposts');
            // console.log("job_post_id:", offer.job_post_id);
            // Loop through job offers and display them with an "Apply" button
            blogposts.forEach(offer => {
                const listItem = document.createElement('li');
                console.log("blogpost_id:", offer.PostId);
                 listItem.innerHTML = `
                    
                    <p><b>Title:</b> ${offer.title}</p>
                    <p><b>Content:</b> ${offer.content}</p>
                    <p><b>Company:</b> ${offer.company_name}</p>
                    <p><b>Employee-Email:</b> ${offer.employee_email}</p>
                    
                    
                 
                `;
                blogpostsList.appendChild(listItem);

            
            });
        })
        .catch(error => console.error('Error fetching job offers:', error));

        
});
