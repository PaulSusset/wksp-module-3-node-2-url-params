"use strict";

const morgan = require("morgan");
const express = require("express");

const { top50 } = require("./data/top50");
const { books } = require("./data/books")

const PORT = process.env.PORT || 7000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
function booksHandle(req, res) {
    let title = '25 books to read';
    res.render("pages/books", {title:title, books:books})
}
function bookInfo(req, res){
    const number = req.params.number
    let book = books.find(book=> {
        return book.id.toString() === number;});
    
    const title = book.title;
    res.render("pages/bookPage", {title: title, book: book})
}
function bookTypeHandle(req, res){
    const genre = req.params.genre
    let title = genre;
    let typeArr = books.filter(book=> book.type === genre);
    res.render("pages/bookType", {title: title, typeArr: typeArr})
}
// handle 404s
app.get("/books", booksHandle)
app.get("/books/:number", bookInfo)
app.get("/books/type/:genre", bookTypeHandle)
app.get("/top50", (req, res) => {
    let title = "Top 50 Songs Streamed on Spotify";
    res.render("pages/top50", { title: title, top50: top50 });
});
app.get("/top50/top-artist", (req, res) => {
    let title = "Most popular artist";
    res.render("pages/topArtist", { title: title, top50: top50 });
});
app.get("/top50/song/:rank", (req, res) => {
    const rank = req.params.rank;
    if (rank <=50 && rank>=1){
    let title = `Song #${rank}`;
    res.render("pages/song", { title: title, top50: top50, rankNum: rank });
    } else {res.status(404);

        res.render("pages/fourOhFour", { title: "Oops" });}
});

app.get("*", (req, res) => {
    res.status(404);

    res.render("pages/fourOhFour", { title: "Oops" });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
