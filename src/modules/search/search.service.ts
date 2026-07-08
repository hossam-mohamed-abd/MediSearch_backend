import { SearchRepository } from "./search.repository";

export class SearchService {
  private repository = new SearchRepository();

  async search(
    q: string,
    page: number,
    limit: number,
    userId: bigint | null,
    ipAddress: string | null,
  ) {
    const result = await this.repository.search(q, page, limit);

    if (q.trim().length >= 3) {
      await this.repository.createSearchLog(
        q,
        userId,
        ipAddress,
        result.data.length ? BigInt(result.data[0].id) : null,
      );
    }

    return result;
  }
}
