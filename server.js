const express = require('express');
const app = express();
const api = require('./server/routes/api');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


mongoose.connect('mongodb://localhost/expenses', { useNewUrlParser: true });
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', api);

//Seeds DB
// const Expense = require("./server/model/Expense");
// const expenses = require("./data.json");
// for (let expense of expenses) {
//     const newExpense = new Expense(expense);
//     newExpense.save();
// }

const port = 3000;
app.listen(port, () => console.log(`Running server on port ${ port }`));