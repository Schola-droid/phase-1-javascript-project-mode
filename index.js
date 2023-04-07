// Select DOM elements
const sleepForm = document.getElementById('sleep-form');
const scheduleList = document.getElementById('schedule-list');
const commentsContainer = document.getElementById('comments-container');

// Fetch sleeping schedule data from server and display on page
fetch('http://localhost:3000/schedules')
  .then(resp => resp.json())
  .then(data => {
    displaySchedule(data)
    const commentForm = document.querySelector('#comment-form');
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault()
      console.log("clicked ")
      const comment = document.querySelector("#comment")
      console.log(comment.value)
      const commentValue = comment.value
      fetch(`http://localhost:3000/schedules/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: commentValue })
      })
      .then(resp => resp.json())
      .then(data => {
        alert('Your comment has been successfully received')
        console.log(data)})
      commentForm.reset()
    });
    
});
function displaySchedule(schedule) {
  scheduleList.innerHTML = '';

  schedule.forEach(item => {
    const li = document.createElement('li');
    const startTime = new Date(item.startTime).toLocaleTimeString();
    const endTime = new Date(item.endTime).toLocaleTimeString();

    li.innerHTML = `<span>${item.dayOfWeek} - ${startTime} to ${endTime}</span>
                    <button data-id="${item.id}" class="edit-btn">Edit</button>
                    <button data-id="${item.id}" class="delete-btn">Delete</button>`;
    scheduleList.appendChild(li);
  });
}

// Add event listener to the set schedule form
sleepForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const dayOfWeek = event.target.elements['day-of-week'].value;
  const startTime = new Date().toDateString() + ' ' + event.target.elements['start-time'].value;
  const endTime = new Date().toDateString() + ' ' + event.target.elements['end-time'].value;

  // Send the new sleeping schedule to the server
  fetch('http://localhost:3000/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dayOfWeek,
      startTime,
      endTime
    })
  })
    .then(resp => resp.json())
    .then(schedule => {
      displaySchedule([schedule]);
      sleepForm.reset();
    });
});

// Add event listener to the delete and edit buttons
scheduleList.addEventListener('click', (event) => {
  const id = event.target.dataset.id;
  const isDeleteBtn = event.target.classList.contains('delete-btn');
  const isEditBtn = event.target.classList.contains('edit-btn');

  if (isDeleteBtn) {
    // Delete the sleeping schedule from the server and remove it from the list
    fetch(`http://localhost:3000/schedules/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const li = event.target.parentElement;
        li.remove();
      });
  } else if (isEditBtn) {
    // Get the sleeping schedule from the server and prefill the form
    fetch(`http://localhost:3000/schedules/${id}`)
      .then(resp => resp.json())
      .then(schedule => {
        sleepForm.elements['day-of-week'].value = schedule.dayOfWeek;
        sleepForm.elements['start-time'].value = new Date(schedule.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        sleepForm.elements['end-time'].value = new Date(schedule.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        sleepForm.dataset.id = id;
        sleepForm.elements['submit-btn'].textContent = 'Update';
       
        









      });
  }
});

function displayComment(comment) {
  const div = document.createElement('div');
  div.classList.add('comment');
  div.innerHTML = `<p>${comment.comment}</p>`;
  commentsContainer.appendChild(div);
}



