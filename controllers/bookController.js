// controllers/bookController.js
import Book from '../models/book.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const createBook = async (req, res) => {
  const { title, author, genre, description } = req.body;
  const { userId } = req;

  // Validate input
  if (!title || !author || !genre || !description) {
    throw new ApiError(400, 'All fields are required');
  }

  try {
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      createdBy: userId,
    });

    await newBook.save();
    console.log("book id",newBook._id)
    res.status(201).json(new ApiResponse(201, newBook, 'Book created successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    // Use ApiError to structure the error response
    res.status(statusCode).json(new ApiResponse(statusCode, null, message, errors));
  }
};

// Fetch all books with their reviews
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('reviews.userId', 'username');
    res.status(200).json(new ApiResponse(200, books, 'Books fetched successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json(new ApiResponse(statusCode, null, message, errors));
  }
};
export const addReview = async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  const userId = req.userId; // Assume userId is added by verifyToken middleware

  if (!bookId || !rating || !reviewText) {
    throw new ApiError(400, 'Missing required fields');
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'Rating must be between 1 and 5');
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    book.reviews.push({ userId, rating, reviewText });
    await book.save();

    res.status(201).json(new ApiResponse(201, book, 'Review added successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json(new ApiResponse(statusCode, null, message, errors));
  }
};
// Fetch a single book with reviews
export const getBookDetails = async (req, res) => {
  const { bookId } = req.query;

  if (!bookId) {
    throw new ApiError(400, 'Book ID is required');
  }

  try {
    const book = await Book.findById(bookId).populate('reviews.userId', 'username');
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }

    res.status(200).json(new ApiResponse(200, book, 'Book details fetched successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json(new ApiResponse(statusCode, null, message, errors));
  }
};
