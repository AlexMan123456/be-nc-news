const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const request = require("supertest")
const app = require("../app.js")
const endpoints = require("../endpoints.json")

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
            .get("/api/articles/1")
            .expect(200)
            .then((response) => {
                expect(response.body.article.article_id).toBe(1)
                expect(typeof response.body.article.author).toBe("string")
                expect(typeof response.body.article.title).toBe("string")
                expect(typeof response.body.article.body).toBe("string")
                expect(typeof response.body.article.topic).toBe("string")
                expect(typeof response.body.article.created_at).toBe("string")
                expect(typeof response.body.article.votes).toBe("number")
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
                expect(response.body.message).toBe("Request must contain username")
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
                expect(response.body.message).toBe("Request must contain body")
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