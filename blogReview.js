
document.addEventListener('DOMContentLoaded', function () {
    // Fetch job offers from the server
    fetch('/getBlogPosts')
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
                    
                    <p class="title"><b>Title:</b> </p>
                    <p>${offer.title}</p>
                    <p class="title"><b>Content:</b></p>
                    <p>${offer.content}</p>
                    <p class="title"><b>Company:</b> </p>
                    <p>${offer.company_name}</p>
                    <p class="title"><b>Employee-Email:</b> </p>
                    <p>${offer.employee_email}</p>
                    
                    <button class="approve-button" data-post-id="${offer.PostId}">Approve</button>
                 
                `;
                blogpostsList.appendChild(listItem);

                const approveButton = listItem.querySelector('.approve-button');
                approveButton.addEventListener('click', function () {
                    // Call a function to handle the approval and posting of the blog post
                    approveBlogPost(offer.PostId);
                });
            });
        })
        .catch(error => console.error('Error fetching job offers:', error));

        function approveBlogPost(PostId) {
            // You can add code here to post the approved blog post to the server
            // For example, you can use the fetch API to send a POST request
            fetch('/approveBlogPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PostId: PostId,
                }),
            })
            .then(response => response.json())
            .then(result => {
                console.log('Blog post approved and posted:', result);
                // You can update the UI or perform any other actions as needed
            })
            .catch(error => console.error('Error approving blog post:', error));
        }
});
