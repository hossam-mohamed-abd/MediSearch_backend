"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const search_repository_1 = require("./search.repository");
class SearchService {
    repository = new search_repository_1.SearchRepository();
    async search(q, page, limit, userId, ipAddress) {
        const result = await this.repository.search(q, page, limit);
        if (q.trim().length >= 3) {
            await this.repository.createSearchLog(q, userId, ipAddress, result.data.length ? BigInt(result.data[0].id) : null);
        }
        return result;
    }
}
exports.SearchService = SearchService;
