# Backend_Task

Steps to run the application - 
1) run npm install to install all used dependencies
2) run the server using npm start

Here are the available endpoints:

List API with search and pagination: GET /customers?firstName=Aman&lastName=Gupta&city=Ahmedabad&page=1&limit=10
Get a single customer by ID: GET /customers/{id}
List all unique cities with the number of customers from each city: GET /cities
Add a customer: POST /customers
You can use tools like Postman or cURL to make requests to these endpoints and test the API.
