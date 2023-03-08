const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const todoSchema = require('../schemas/todoSchema');

// Create a model
const Todo = new mongoose.model('Todo', todoSchema);

// Get all TODOs
router.get('/', async (req, res) => {
    await Todo.find({ status: 'inactive' })
        .select({
            _id: 0,
            __v: 0,
            date: 0,
        })
        .then((data) => {
            res.status(200).json({
                message: 'Data found!',
                result: data,
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

// Get a TODO
router.get('/:id', async (req, res) => {
    await Todo.findOne({ _id: req.params.id })
        .then((data) => {
            res.status(200).json({
                message: 'Data found!',
                result: data,
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

// Post a TODO
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo
        .save()
        .then(() => {
            res.status(200).json({
                message: 'Todo created successfully!',
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

// Post Multiple TODOs
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body)
        .then(() => {
            res.status(200).json({
                message: 'Todo created successfully!',
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

// Put a TODO
router.put('/:id', async (req, res) => {
    await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: 'inactive',
            },
        },
        {
            new: true,
            useFindAndModify: false,
        }
    )
        .then((data) => {
            res.status(200).json({
                message: 'Todo updated successfully!',
                result: data,
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

// Delete a TODO
router.delete('/:id', async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: 'Todo Deleted successfully!',
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

module.exports = router;
