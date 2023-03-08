const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const todoSchema = require('../schemas/todoSchema');

// Create a model
const Todo = new mongoose.model('Todo', todoSchema);

// Get all TODOs
router.get('/', async (req, res) => {});

// Get a TODO
router.get('/:id', async (req, res) => {});

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
router.put('/:id', async (req, res) => {});

// Delete a TODO
router.delete('/:id', async (req, res) => {});

module.exports = router;
