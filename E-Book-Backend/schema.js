import { pgTable, serial, text,varchar,real } from 'drizzle-orm/pg-core';

//Books
export const books = pgTable('books', {
    id:serial('id').primaryKey(),
    image:text('image').notNull(),
    description:text('description').notNull(),
    title:text('title').notNull(),
    download:text('download').notNull(),
    reviews:real('reviews').notNull(),
    author:text('author').notNull(),
    genre:text('genre').notNull()
});

//Users
export const users=pgTable('users',{
    id:serial('user_id').primaryKey(),
    username:text('username').unique().notNull(),
    password:text('password').notNull()
});