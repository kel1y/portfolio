console.log('init');

document.querySelector("#close-btn").addEventListener("click", () => {
  document.querySelector("form").style.display = "none";
});

document.querySelector("#show-form").addEventListener("click", () => {
  document.querySelector("form").style.display = "block";
});
