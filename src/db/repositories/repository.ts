export interface PaginatedResult<T> {
    data: T[];
    count: number;
}

export interface IRepository<T> {
    findAllAsync(): Promise<T[]>;
    findAllByPage(pageNumber: number, pageSize: number): Promise<PaginatedResult<T>>;
    findByIdAsync(id: number): Promise<T>;
    textSearchAsync(term: string): Promise<T[]>;
}
