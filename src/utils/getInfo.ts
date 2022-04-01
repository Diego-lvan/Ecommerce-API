import "dotenv/config";

interface info {
  prev: string | null;
  count: number;
  pages: number;
  next: string | null;
}

const getInfo = (page: number, limit: number, totalPages: number, countRows: number, queries: any[], table: string): info => {
  const URL: string = process.env.URL;
  const queriesUrl = queries
    .map((query) => {
      const key = Object.keys(query)[0];
      return `&${key}=${query[key]}`;
    })
    .join("");

  const info: info = {
    prev: page === 0 ? null : `${URL}/${table}?page=${page}&limit=${limit}${queriesUrl}`,
    count: countRows,
    pages: totalPages,
    next: page + 2 > totalPages ? null : `${URL}/${table}?page=${page + 2}&limit=${limit}${queriesUrl}`,
  };
  return info;
};

export default getInfo;
