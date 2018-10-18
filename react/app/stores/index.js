import ConfigStore from './config.store';
import PostStore from './post.store';
import MatchStore from './match.store';

const config = new ConfigStore()
const posts = new PostStore()
const matches = new MatchStore()
export default {config, posts, matches}
