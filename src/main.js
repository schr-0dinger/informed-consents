document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchbar");
  const resultBox = document.getElementById("resultbox");
  // Function to perform the search
  function performSearch(query, procedures) {
    const lowerCaseQuery = query.toLowerCase();
    return procedures.filter((procedure) =>
      procedure.procedure_name.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Function to display "No results found" message
  function displayNoResults() {
    resultBox.innerHTML = `<div class="alert alert-warning">
    <strong> സോറി. ഇതിന്‍റെ സമ്മതപത്രം ഇവിടെയില്ല 😢 </strong> 
    <div> <a href="https://forms.gle/3kdvUYi3EegR92kc8" class='btn btn-primary mt-2' target="_blank" > Request for Consent </a></div>
    </div>`;
  }

  // Function to display search results in the resultBox
  function displayResults(results) {
    resultBox.innerHTML = "";

    if (results.length === 0) {
      displayNoResults();
    } else {
      results.forEach((result) => {
        const { procedure_name, category, file } = result;

        const currentUrl = window.location.href.replace(/\/(#)?$/, '');

        const procedure_name_corrected = procedure_name
          .toLowerCase()
          .replace(/[\s\/\(\)\&\+\'\"\`\:\;\<\>]/g, "")
          .toString();

        const resultItem = document.createElement("div");
        // resultItem.innerHTML = `<p><strong>${procedure_name}</strong></p>
        //                         <p>Category: ${category}</p>
        //                         <p>File: <a href="${file}" target="_blank">${file}</a></p>`;
        resultItem.innerHTML = `<button type="button" class="btn btn-primary my-1" data-bs-toggle="modal" data-bs-target="#${procedure_name_corrected}Id">
        ${procedure_name}
      </button>
    </div>
    
    <!-- The Modal -->
    <div class="modal mt-3" id="${procedure_name_corrected}Id">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h4 class="modal-title">${procedure_name}</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
    
          <div class="modal-body">
           <iframe src="${currentUrl}${file}" width="100%" height="550"></iframe>
            </div>
    
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div>
    
        </div>
      </div>
    </div> 
        
        `;

        resultBox.appendChild(resultItem);
      });
    }
  }

  // Fetch and process data
  fetch("src/contents.json")
    .then((response) => response.json())
    .then((jsonData) => {
      const procedures = Object.entries(jsonData.index).flatMap(
        ([category, procedureList]) =>
          procedureList.map((procedure) => ({ category, ...procedure }))
      );

      // Event listener for input changes
      searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value;

        if (searchQuery.length <= 1) {
          // If search input is blank, clear the results
          resultBox.innerHTML = "";
        } else {
          const searchResults = performSearch(searchQuery, procedures);
          displayResults(searchResults.length === 0 ? [] : searchResults);
        }
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));
});
