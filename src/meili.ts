import { MeiliSearch } from 'meilisearch';

// search-only key
export const client = new MeiliSearch({
	host: 'https://saint-luke.net:7700',
	apiKey: '72ae6d2bfda2079d522d42b96445d74b216e92f461ee1e017de4e3c6eb37b4a8'
});

// we only need the one index
export const index = client.index('prayers');
