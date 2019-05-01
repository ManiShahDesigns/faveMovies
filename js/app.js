// Movie class

class Movie {
  constructor(title, director, year){
    this.title = title;
    this.director = director;
    this.year = year;
  }

}

// UI class
class UI {

  // 1- Add movies to the HTML list
  addMovieToList(movie){
  const list = document.getElementById('movie-list');
  // Create a table row
  const row = document.createElement('tr');
  // Insert columns
  row.innerHTML = `
    <td class="title">${movie.title}</td>
    <td>${movie.director}</td>
    <td>${movie.year}</td>
    <td><a href="#" class="delete">X</a></td>
  `
  // Append the created row to the movie list
  list.appendChild(row);
  }

  // 2- Clear UI fields
  clearFields(){
    document.getElementById('title').value = "";
    document.getElementById('director').value = "";
    document.getElementById('year').value = "";
  }

  // 3- Display Success/Failure Message
  displayAlert(errorMessage, className){
    // Create error div
    const div = document.createElement('div');
    // Add class name to the div
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(errorMessage));
    // Get parents
    const container = document.querySelector('.container');
    // Get the form element
    const form = document.getElementById('movie-form');
    // Insert error alert
    container.insertBefore(div, form);
    // Remove error alert after 2.5 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 2500);
  }

  // 4 - Delete movies if user presses X
  deleteMovies(e){
    if(e.className === 'delete'){
      e.parentElement.parentElement.remove();
    }
  }
}

// Local Storage Class 
class Store {
  static getMovies(){
    let movies;
    if(localStorage.getItem('movies') === null){
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem('movies'));
    }
    return movies;
  }

  static displayMovies(){
    // Get movies in Local Storage
    const movies = Store.getMovies();
    // Loop through 
    movies.forEach(function(movie){
      // Instantiate the UI class
      const ui = new UI;
      // Add movie to UI
      ui.addMovieToList(movie);
    });
  }

  static addMovie(movie){

    // Get Movies in Local Storage
    const movies = Store.getMovies();

    // Push the new movie to the movies array
    movies.push(movie);

    // Set Local Storage with the new movie added
    localStorage.setItem('movies', JSON.stringify(movies))

  }

  static removeMovie(year){

    // Get Movies in Local Storage
    const movies = Store.getMovies();

    // Loop through movies and delete the one that has been clicked on  
    movies.forEach(function(movie, index){
      if(movie.year === year){
        movies.splice(index, 1)
      }
    });

    localStorage.setItem('movies', JSON.stringify(movies));
  }
}

// Event listener for Local Storage to display movies on DOM Load
document.addEventListener('DOMContentLoaded', Store.displayMovies);

// Event Listener for the submit button
document.getElementById('movie-form').addEventListener('submit', function(e){
  
  // Input Data Selectors
  const title = document.getElementById('title').value,
        director = document.getElementById('director').value,
        year = document.getElementById('year').value;
  
    // Instantiate the Movie constructor
    const movie = new Movie(title, director, year);
  
    // Instantiate the UI constructor
    const ui = new UI();
  
    // Validate 
    if(title === "" || director === "" || year === ""){
      // Show error alert
      ui.displayAlert('Please add the required information into the fields', 'error')
    } else {
  
      // Add Movies to the list
      ui.addMovieToList(movie);

      // Add Movies to Local Storage
      Store.addMovie(movie);
  
      // Show success alert
      ui.displayAlert(`${title} added`, 'success');
  
      // Clear data fields
      ui.clearFields();
    }
    // Prevent default behaviour of the element
    e.preventDefault();
  });
  
  // Event Listener for the delete button 
  document.getElementById('movie-list').addEventListener('click', function(e){

    // Instantiate the UI constructor
    const ui = new UI();
  
    // Delete movie from UI function
    ui.deleteMovies(e.target);

    // Delete movie from Local Storage function
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);
    
    // Show success message 
    ui.displayAlert('Movie removed successfully' , 'success');
        
    // Prevent default behaviour of the element
    e.preventDefault();
  })
  