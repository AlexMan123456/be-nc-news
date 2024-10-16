const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const request = require("supertest")
const app = require("../app.js")
const endpoints = require("../endpoints.json")
require("jest-sorted")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe("/api/topics", () => {
    describe("GET", () => {
        test("200: Responds with an array of topic objects, each with a key of description and slug, whose values are both strings", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                expect(response.body.topics.length).toBe(3)
                response.body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe("string")
                    expect(typeof topic.slug).toBe("string")
                })
            })
        })
    })
})

describe("/api", () => {
    describe("GET", () => {
        test("200: Responds with an object containing details of all endpoints", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                expect(response.body.endpoints).toEqual(endpoints)
            })
        })
    })
})

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("200: Responds with an article object containing all correct properties with correct types, matched with the correct ID", () => {
            return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then((response) => {
                expect(response.body.article.article_id).toBe(2)
                expect(typeof response.body.article.author).toBe("string")
                expect(typeof response.body.article.title).toBe("string")
                expect(typeof response.body.article.body).toBe("string")
                expect(typeof response.body.article.topic).toBe("string")
                expect(typeof response.body.article.created_at).toBe("string")
                expect(typeof response.body.article.votes).toBe("number")
                expect(typeof response.body.article.comment_count).toBe("number")
                expect(typeof response.body.article.article_img_url).toBe("string")
            })
        })
        test("400: Responds with a bad request message if given an invalid ID", () => {
            return request(app)
            .get("/api/articles/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message if given a valid ID, but the article associated with it does not exist", () => {
            return request(app)
            .get("/api/articles/69")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Article not found")
            })
        })
    })
    describe("PATCH", () => {
        test("200: Increments the vote count by the given amount", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: 10})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedArticle.article_id).toBe(1)
                expect(response.body.updatedArticle.votes).toBe(110)
                expect(typeof response.body.updatedArticle.author).toBe("string")
                expect(typeof response.body.updatedArticle.title).toBe("string")
                expect(typeof response.body.updatedArticle.body).toBe("string")
                expect(typeof response.body.updatedArticle.topic).toBe("string")
                expect(typeof response.body.updatedArticle.created_at).toBe("string")
                expect(typeof response.body.updatedArticle.article_img_url).toBe("string")
            })
        })
        test("200: Decrements the vote count by the given amount", () => {
            request(app)
            .patch("/api/articles/1")
            .send({inc_votes: -10})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedArticle.article_id).toBe(1)
                expect(response.body.updatedArticle.votes).toBe(90)
                expect(typeof response.body.updatedArticle.author).toBe("string")
                expect(typeof response.body.updatedArticle.title).toBe("string")
                expect(typeof response.body.updatedArticle.body).toBe("string")
                expect(typeof response.body.updatedArticle.topic).toBe("string")
                expect(typeof response.body.updatedArticle.created_at).toBe("string")
                expect(typeof response.body.updatedArticle.article_img_url).toBe("string")
            })
        })
        test("200: Ignore any extra keys on request body and update votes as usual", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: 10, extraKey: 5})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedArticle.article_id).toBe(1)
                expect(response.body.updatedArticle.votes).toBe(110)
                expect(typeof response.body.updatedArticle.author).toBe("string")
                expect(typeof response.body.updatedArticle.title).toBe("string")
                expect(typeof response.body.updatedArticle.body).toBe("string")
                expect(typeof response.body.updatedArticle.topic).toBe("string")
                expect(typeof response.body.updatedArticle.created_at).toBe("string")
                expect(typeof response.body.updatedArticle.article_img_url).toBe("string")
                expect(typeof response.body.updatedArticle).not.toHaveProperty("extraKey")
            })
        })
        test("400: Responds with a bad request message if inc_votes key is not found on response body", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("One or more properties must not be null")
            })
        })
        test("400: Responds with a bad request message if contents of inc_votes key is not a number", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: "abc"})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if contents of inc_votes key is a number but not an integer", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: 10.5})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Responds with a bad request message if article_id is invalid", () => {
            return request(app)
            .patch("/api/articles/invalid_article")
            .send({inc_votes: 10})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message if article_id is valid, but the article associated with it does not exist", () => {
            return request(app)
            .patch("/api/articles/271828")
            .send({inc_votes: 10})
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Article not found")
            })
        })
    })
})

describe("/api/articles", () => {
    describe("GET", () => {
        test("200: Responds with an array containing all articles with correct properties of correct types", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toBe(13)
                response.body.articles.forEach((article) => {
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.topic).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(typeof article.comment_count).toBe("number")
                })
            })
        })
        test("200: Sorts articles by created_at date in descending order by default", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy("created_at", {descending: true})
            })
        })
        describe("Extra queries", () => {
            test("200: Sorts by the given sort_by query when given a valid column to sort by", () => {
                return Promise.all([request(app)
                    .get("/api/articles?sort_by=article_id")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("article_id", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=author")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("author", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=title")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("title", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=topic")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("topic", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=created_at")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("created_at", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=votes")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("votes", {descending: true})
                    }),
                    request(app)
                    .get("/api/articles?sort_by=comment_count")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("comment_count", {descending: true})
                    })
                ])
            })
            test("200: Sorts in ascending order when given an order query of asc, case insensitive", () => {
                return Promise.all([
                    request(app)
                    .get("/api/articles?order=asc")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("created_at", {ascending: true})
                    }),
                    request(app)
                    .get("/api/articles?order=ASC")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("created_at", {ascending: true})
                    }),
                    request(app)
                    .get("/api/articles?order=aSc")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.articles).toBeSortedBy("created_at", {ascending: true})
                    }),
                ])
            })
            test("200: Sorts in ascending order by given sort_by query when order is asc", () => {
                return request(app)
                .get("/api/articles?sort_by=article_id&order=asc")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles).toBeSortedBy("article_id", {ascending: true})
                })
            })
            test("200: Filters articles by given topic when given a valid topic query", () => {
                return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles.length).toBe(12)
                    response.body.articles.forEach((article) => {
                        expect(typeof article.article_id).toBe("number")
                        expect(typeof article.author).toBe("string")
                        expect(typeof article.title).toBe("string")
                        expect(typeof article.created_at).toBe("string")
                        expect(typeof article.votes).toBe("number")
                        expect(typeof article.article_img_url).toBe("string")
                        expect(typeof article.comment_count).toBe("number")
                        expect(article.topic).toBe("mitch")
                    })
                })
            })
            test("200: Responds with an empty array when given a topic that exists but has no articles", () => {
                return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then((response) => {
                    expect(response.body.articles.length).toBe(0)
                })
            })
            test("400: Returns a bad request message when given an invalid sort_by query", () => {
                return request(app)
                .get("/api/articles?sort_by=invalid_sort_by")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                })
            })
            test("400: Returns a bad request message when given an invalid order query", () => {
                return request(app)
                .get("/api/articles?sort_by=invalid_order")
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                })
            })
            test("404: Responds with not found when given a topic that doesn't exist", () => {
                return request(app)
                .get("/api/articles?topic=nonexistent_topic")
                .expect(404)
                .then((response) => {
                    expect(response.body.message).toBe("Not found")
                })
            })
        })
    })
    describe("POST", () => {
        test("201: Successfully posts the article and returns an object representation of it with all correct properties", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "Test Title",
                body: "Test body",
                topic: "paper",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700"
            })
            .expect(201)
            .then((response) => {
                expect(response.body.postedComment.author).toBe("butter_bridge")
                expect(response.body.postedComment.title).toBe("Test Title")
                expect(response.body.postedComment.body).toBe("Test body")
                expect(response.body.postedComment.topic).toBe("paper")
                expect(response.body.postedComment.article_img_url).toBe("https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700")
                expect(typeof response.body.postedComment.article_id).toBe("number")
                expect(response.body.postedComment.votes).toBe(0)
                expect(typeof response.body.postedComment.votes).toBe("number")
                expect(response.body.postedComment.comment_count).toBe(0)
            })
        })
        test("201: Ignores any extra properties on object being posted", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "Test Title",
                body: "Test body",
                topic: "paper",
                article_img_url: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
                extraKey: "extra content"
            })
            .expect(201)
            .then((response) => {
                expect(response.body.postedComment.author).toBe("butter_bridge")
                expect(response.body.postedComment.title).toBe("Test Title")
                expect(response.body.postedComment.body).toBe("Test body")
                expect(response.body.postedComment.topic).toBe("paper")
                expect(response.body.postedComment.article_img_url).toBe("https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700")
                expect(typeof response.body.postedComment.article_id).toBe("number")
                expect(response.body.postedComment.votes).toBe(0)
                expect(typeof response.body.postedComment.votes).toBe("number")
                expect(response.body.postedComment.comment_count).toBe(0)
                expect(response.body.postedComment).not.toHaveProperty("extraKey")
            })
        })
        test("201: Defaults to the correct image URL if no article_img_url is provided", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "Test Title",
                body: "Test body",
                topic: "paper",
            })
            .expect(201)
            .then((response) => {
                expect(response.body.postedComment.author).toBe("butter_bridge")
                expect(response.body.postedComment.title).toBe("Test Title")
                expect(response.body.postedComment.body).toBe("Test body")
                expect(response.body.postedComment.topic).toBe("paper")
                expect(response.body.postedComment.article_img_url).toBe("https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700")
                expect(typeof response.body.postedComment.article_id).toBe("number")
                expect(response.body.postedComment.votes).toBe(0)
                expect(typeof response.body.postedComment.votes).toBe("number")
                expect(response.body.postedComment.comment_count).toBe(0)
                expect(response.body.postedComment).not.toHaveProperty("extraKey")
            })
        })
        test("400: Returns a bad request message if any other property is missing", () => {
            return Promise.all([
                request(app)
                .post("/api/articles")
                .send({
                    title: "Test title",
                    body: "Test body",
                    topic: "paper",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                }),
                request(app)
                .post("/api/articles")
                .send({
                    author: "butter_bridge",
                    body: "Test body",
                    topic: "paper",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                }),
                request(app)
                .post("/api/articles")
                .send({
                    author: "butter_bridge",
                    title: "Test title",
                    body: "Test body",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                }),
                request(app)
                .post("/api/articles")
                .send({
                    author: "butter_bridge",
                    title: "Test title",
                    topic: "paper",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.message).toBe("Bad request")
                })
            ])
        })
        test("404: Returns a not found message if given author does not exist in database", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "nonexistent_user",
                title: "Test title",
                body: "Test body",
                topic: "paper",
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Not found")
            })
        })
        test("404: Returns a not found message if given topic does not exist in database", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "butter_bridge",
                title: "Test title",
                body: "Test body",
                topic: "nonexistent topic",
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Not found")
            })
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("200: Responds with an array of all comments associated with a given ID", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(11)
                response.body.comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.author).toBe("string")
                    expect(typeof comment.body).toBe("string")
                    expect(comment.article_id).toBe(1)
                })
            })
        })
        test("200: Responds with an empty array if given an ID from an article containing no comments", () => {
            return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(0)
            })
        })
        test("400: Responds with a bad request message if given an invalid ID", () => {
            return request(app)
            .get("/api/articles/invalid_id/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message if given a valid ID, but the article associated with it does not exist", () => {
            return request(app)
            .get("/api/articles/420/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Article not found")
            })
        })
    })
    describe("POST", () => {
        test("201: Adds a comment to an article", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge",
                body: "My comment"
            })
            .expect(201)
            .then((response) => {
                expect(typeof response.body.comment.comment_id).toBe("number")
                expect(typeof response.body.comment.votes).toBe("number")
                expect(typeof response.body.comment.created_at).toBe("string")
                expect(response.body.comment.author).toBe("butter_bridge")
                expect(response.body.comment.body).toBe("My comment")
                expect(response.body.comment.article_id).toBe(1)
            })
        })
        test("201: If any extra properties exist on comment object being sent, ignore other properties and add comment as usual", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge",
                body: "My comment",
                extraKey: "extra content"
            })
            .expect(201)
            .then((response) => {
                expect(typeof response.body.comment.comment_id).toBe("number")
                expect(typeof response.body.comment.votes).toBe("number")
                expect(typeof response.body.comment.created_at).toBe("string")
                expect(response.body.comment.author).toBe("butter_bridge")
                expect(response.body.comment.body).toBe("My comment")
                expect(response.body.comment.article_id).toBe(1)
                expect(response.body.comment).not.toHaveProperty("extraKey")
            })
        })
        test("400: Sends a bad request message if comment object being sent does not contain a username", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                body: "My comment"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("One or more properties must not be null")
            })
        })
        test("400: Sends a bad request message if comment object being sent does not contain a body", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("One or more properties must not be null")
            })
        })
        test("404: Sends a not found message if username does not exist in database", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "unknown_user",
                body: "My comment"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Not found")
            })
        })
        test("400: Sends a bad request message if given an invalid article ID", () => {
            return request(app)
            .post("/api/articles/invalid_id/comments")
            .send({
                username: "butter_bridge",
                body: "My comment"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Sends a not found message if given a valid ID, but the article associated with that ID does not exist", () => {
            return request(app)
            .post("/api/articles/314159/comments")
            .send({
                username: "butter_bridge",
                body: "My comment"
            })
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Not found")
            })
        })
    })
})

describe("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with an array containing all users", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                expect(response.body.users.length).toBe(4)
                response.body.users.forEach((user) => {
                    expect(typeof user.username).toBe("string")
                    expect(typeof user.name).toBe("string")
                    expect(typeof user.avatar_url).toBe("string")
                })
            })
        })
    })
})

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("204: Deletes the comment with the associated ID", () => {
            return request(app)
            .delete("/api/comments/3")
            .expect(204)
        })
        test("400: Returns a bad request message if ID is invalid", () => {
            return request(app)
            .delete("/api/comments/invalid_comment_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Returns a not found message if ID is valid but the comment associated with it does not exist", () => {
            return request(app)
            .delete("/api/comments/360")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Comment not found")
            })
        })
    })
    describe("PATCH", () => {
        test("200: Increments the vote count by the given amount", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({inc_votes: 4})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedComment.comment_id).toBe(1)
                expect(typeof response.body.updatedComment.body).toBe("string")
                expect(response.body.updatedComment.votes).toBe(20)
                expect(typeof response.body.updatedComment.author).toBe("string")
                expect(typeof response.body.updatedComment.article_id).toBe("number")
                expect(typeof response.body.updatedComment.created_at).toBe("string")
            })
        })
        test("200: Decrements the vote count by the given amount", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({inc_votes: -6})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedComment.comment_id).toBe(1)
                expect(typeof response.body.updatedComment.body).toBe("string")
                expect(response.body.updatedComment.votes).toBe(10)
                expect(typeof response.body.updatedComment.author).toBe("string")
                expect(typeof response.body.updatedComment.article_id).toBe("number")
                expect(typeof response.body.updatedComment.created_at).toBe("string")
            })
        })
        test("200: Ignores any extra keys on object being sent", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({inc_votes: 4, extraKey: 5})
            .expect(200)
            .then((response) => {
                expect(response.body.updatedComment.comment_id).toBe(1)
                expect(typeof response.body.updatedComment.body).toBe("string")
                expect(response.body.updatedComment.votes).toBe(20)
                expect(typeof response.body.updatedComment.author).toBe("string")
                expect(typeof response.body.updatedComment.article_id).toBe("number")
                expect(typeof response.body.updatedComment.created_at).toBe("string")
                expect(response.body.updatedComment).not.toHaveProperty("extraKey")
            })
        })
        test("400: Returns a bad request message if inc_votes key not provided", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("One or more properties must not be null")
            })
        })
        test("400: Returns a bad request message if inc_votes is not a number", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({inc_votes: "a"})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("400: Returns a bad request message if article_id is invalid", () => {
            return request(app)
            .patch("/api/comments/invalid_id")
            .send({inc_votes: 4})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Returns a not found message if article_id is invalid", () => {
            return request(app)
            .patch("/api/comments/628")
            .send({inc_votes: 4})
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Comment not found")
            })
        })
    })
})

describe("/*", () => {
    test("404: Responds with an error if given an invalid endpoint", () => {
        return request(app)
        .get("/api/invalid_endpoint")
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("Invalid endpoint")
        })
    })
})