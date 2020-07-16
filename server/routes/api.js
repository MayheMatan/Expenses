const express = require('express');
const moment = require('moment');
const router = express.Router()
const Expense = require('../model/Expense');

router.get("/expenses", (req, res) => {
    const { d1, d2 } = req.query;
    if (d1 && d2) {
        Expense.find({
            date: { "$gt": moment(d1).toDate(), "$lt": moment(d2).toDate() }
        }).exec().then(results => res.send(results));
    } else if (d1 && !d2) {
        Expense.find({}).where("date").gt(moment(d1).toDate()).exec().then(results => res.send(results));
    } else {
        Expense.find({}).sort("-date").exec().then(results => res.send(results));
    }
});

router.post("/new", (req, res) => {
    const { name, amount, group } = req.body;
    let { date } = req.body;
    date ? moment(new Date(date)).format("LLLL") : date = moment().format("LLLL");
    const expense = new Expense({ name, amount, group, date });
    expense.save().then(result => {
        console.log(`You've just expansed ${result.amount}$ on ${result.name}`);
        res.end();
    });
});

router.put("/update", (req, res) => {
    const { group1, group2 } = req.query;
    Expense.findOneAndUpdate({ group: group1 }, { group: group2 }, { new: true }, (error, result) => {
        res.send(`Changed ${result.name} where group was ${group1} group to ${result.group} group`)
    });
});

router.get("/expenses/:group", (req, res) => {
    const { group } = req.params;
    const { total } = req.query;
    if (total === 'true') {
        Expense.aggregate([
            { "$match": { group: group } },
            { "$group": { _id: group, totalAmount: { "$sum": "$amount" } } }
        ]).exec().then(results => res.send(results))
    } else {
        Expense.find({}).where("group").equals(group).exec().then(results => res.send(results));
    }
});

module.exports = router