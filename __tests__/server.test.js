const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const request = require("supertest")
const app = require("../app.js")

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
                response.body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe("string")
                    expect(typeof topic.slug).toBe("string")
                })
            })
        })
    })
})

describe("/*", () => {
    test("400: Responds with an error if given an invalid endpoint", () => {
        return request(app)
        .get("/api/invalid_endpoint")
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("Invalid endpoint")
        })
    })
})