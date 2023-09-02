
// Upate 

function editName(e) {
	e.preventDefault();
	fetch("http://localhost:3001/update", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#myForm input[name=id]").value,
			newName: document.querySelector("input[name=updatedName]").value,
		}),
	})
		.then((response) => response.json())
		.then(() => alert("Name Updated!"));
        location.reload();

	document.getElementById("myForm").reset();
}

document.getElementById("myForm").addEventListener("submit", editName);

// Delete USER

function deleteUser(e) {
	e.preventDefault();
	fetch("http://localhost:3001/remove-user", {
		method: "DELETE",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#delete-user input[name=id]").value,
		}),
	}).then((response) => response.json());
	alert("User Deleted!");

    location.reload();
	document.getElementById("delete-user").reset();
}

document.getElementById("delete-user").addEventListener("submit", deleteUser);





function listCustomers() {
    const usersDiv = document.getElementById("data");
    usersDiv.innerHTML = `
    <div class="row">
      <h2 class="col-1">ID</h2>
      <h2 class="col-1">Product URL</h2>
      <h2 class="col-1">Product Name</h2>
      <h2 class="col-1">Product Brief Description</h2>
      <h2 class="col-1">Product Description</h2>
      <h2 class="col-1">Product Image</h2>
      <h2 class="col-1">Product Link</h2>
      <h2 class="col-1">Starting Price</h2>
      <h2 class="col-1">Price Range</h2>
      <h2 class="col-1">User ID</h2>
      <h2 class="col-1">User Name</h2>
      <h2 class="col-1">User Password</h2>
    </div>
    <hr>`;

    fetch("http://localhost:3001/customers")
      .then((res) => res.json())
      .then((data) => {
        data.map((products, i) => {
          usersDiv.innerHTML += `
            <div class="row">
              <h2 class="col-1">${products.id}</h2>
              <h2 class="col-1">${products.product_url}</h2>
              <h2 class="col-1">${products.product_name}</h2>
              <h2 class="col-1">${products.product_brief_description}</h2>
              <h2 class="col-1">${products.product_description}</h2>
              <h2 class="col-1">${products.product_img}</h2>
              <h2 class="col-1">${products.product_link}</h2>
              <h2 class="col-1">${products.starting_price}</h2>
              <h2 class="col-1">${products.price_range}</h2>
              <h2 class="col-1">${products.user_id}</h2>
              <h2 class="col-1">${products.user_name}</h2>
              <h2 class="col-1">${products.user_password}</h2>
              
            </div>
            <hr>`;
        });
      });
  }
  
  document.getElementById("list").addEventListener("click", listCustomers);

  document.getElementById("list").addEventListener("click", function () {
    const usersDiv = document.getElementById("data");
    if (usersDiv.style.display === "none") {
      usersDiv.style.display = "block";
    //   listCustomers();
    } else {
      usersDiv.style.display = "none";
    }
  });
  