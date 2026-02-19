export interface CursorIteratorConfig<TQuery extends { cursor?: string }, TPage, TItem> {
  initialQuery: TQuery;
  getPage: (query: TQuery) => Promise<TPage>;
  getItems: (page: TPage) => TItem[];
  getNextCursor: (page: TPage) => string | null | undefined;
}

export async function* createCursorIterator<TQuery extends { cursor?: string }, TPage, TItem>(
  config: CursorIteratorConfig<TQuery, TPage, TItem>
): AsyncGenerator<TItem, void, void> {
  let query = { ...config.initialQuery };

  while (true) {
    const page = await config.getPage(query);
    const items = config.getItems(page);

    for (const item of items) {
      yield item;
    }

    const nextCursor = config.getNextCursor(page);
    if (!nextCursor) {
      return;
    }

    query = {
      ...query,
      cursor: nextCursor
    };
  }
}
