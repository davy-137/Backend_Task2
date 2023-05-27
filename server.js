const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Load customer data from customers.json
const customers = require('./customers.json');

// List API with search and pagination
app.get('/customers', (req, res) => {
    try{   
        let { firstName, lastName, city, page, limit } = req.query;
        let filteredCustomers = customers;
        
        if (firstName) {
            filteredCustomers = filteredCustomers.filter(
                customer => customer.first_name.toLowerCase() === firstName.toLowerCase()
                );
            }
            
            if (lastName) {
                filteredCustomers = filteredCustomers.filter(
                    customer => customer.last_name.toLowerCase() === lastName.toLowerCase()
                    );
                }
                
    if (city) {
        filteredCustomers = filteredCustomers.filter(
            customer => customer.city.toLowerCase() === city.toLowerCase()
            );
        }
        
        const startIndex = (page - 1) * (limit);
        const endIndex = startIndex + limit;
        const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
        
        res.json(paginatedCustomers);
    }
    catch(err){
        console.log(err);
    }
});

// API to get a single customer by ID
app.get('/customers/:id', (req, res) => {
    try{

        const customerId = parseInt(req.params.id);
        const customer = customers.find(cust => cust.id === customerId);
        
        if (!customer) {
            res.status(404).json({ message: 'Customer not found' });
        } else {
            res.json(customer);
        }
    }
    catch(err){
        console.log(err);
    }
});

// API to list all unique cities with the number of customers from each city
app.get('/cities', (req, res) => {
    try{
        const cityCountMap = customers.reduce((acc, customer) => {
            const city = customer.city;
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});
        
        res.json(cityCountMap);
    }
    catch(err){
        console.log(err);
    }
});

// API to add a customer with validations
app.post('/customers', (req, res) => {
    try{  
        const { id, first_name, last_name, city, company } = req.body;
        
        if (!id || !first_name || !last_name || !city || !company) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        
        const existingCustomer = customers.find(cust => cust.id === id);
        if (existingCustomer) {
            res.status(400).json({ message: 'Customer ID already exists' });
            return;
        }
        
        const existingCity = customers.find(cust => cust.city === city);
        if (!existingCity) {
            res.status(400).json({ message: 'City does not exist' });
            return;
        }
        
        const existingCompany = customers.find(cust => cust.company === company);
        if (!existingCompany) {
            res.status(400).json({ message: 'Company does not exist' });
            return;
        }
        
        const newCustomer = {
            id,
            first_name,
            last_name,
            city,
            company
        };
    
        customers.push(newCustomer);
        res.status(201).json({ message: 'Customer added successfully' });
    }
    catch(err){
        console.log(err);
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
